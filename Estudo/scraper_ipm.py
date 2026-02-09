#!/usr/bin/env python3
"""
Spider para scraping do site IPM Pós-graduação
"""

import requests
from bs4 import BeautifulSoup
import json
import re
from datetime import datetime
from urllib.parse import urljoin, urlparse
import time

class IpmPosScraper:
    def __init__(self):
        self.base_url = 'https://ipmpos.com.br'
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        })
        self.visited_urls = set()
        self.data = {
            "nome": "",
            "site": "https://ipmpos.com.br",
            "descricao": "",
            "cursos": [],
            "publico_alvo": "",
            "precos": {},
            "diferenciais": [],
            "depoimentos": [],
            "equipe": [],
            "certificacoes": [],
            "contato": {
                "email": "",
                "telefone": "",
                "endereco": ""
            },
            "extraido_em": datetime.now().isoformat()
        }
    
    def fetch_page(self, url):
        """Faz o download de uma página"""
        try:
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            return response.text
        except Exception as e:
            print(f"Erro ao buscar {url}: {e}")
            return None
    
    def extract_text_content(self, soup):
        """Extrai todo o texto relevante da página"""
        # Remove scripts e styles
        for script in soup(["script", "style"]):
            script.decompose()
        
        text = soup.get_text(separator=' ', strip=True)
        return text
    
    def find_courses(self, text, soup):
        """Busca por cursos mencionados no site"""
        # Procura por seções de cursos
        course_sections = soup.find_all(['h1', 'h2', 'h3', 'h4', 'div', 'section'], 
                                         class_=re.compile(r'curso|course|especializacao|pos|mba', re.I))
        
        # Procura por textos que mencionam cursos
        course_patterns = [
            r'(?:Pós-graduação|Especialização|MBA|Curso)\s+(?:em\s+)?([A-Za-zÀ-ÿ\s]{3,50}?)(?:\s+-|\s*\n|\s*\.|<|$)',
            r'([A-Za-zÀ-ÿ\s]{3,40})\s+(?:com\s+)?(?:Certificado|Carga\s+horária)',
        ]
        
        # Palavras-chave de cursos médicos/healthcare
        medical_courses = [
            'Oftalmologia', 'Cardiologia', 'Dermatologia', 'Ortopedia', 'Ginecologia',
            'Pediatria', 'Medicina', 'Enfermagem', 'Fisioterapia', 'Nutrição',
            'Psicologia', 'Odontologia', 'Farmácia', 'Fonoaudiologia', 'Terapia',
            'Cirurgia', 'Anestesiologia', 'Radiologia', 'Urologia', 'Neurologia',
            'Psiquiatria', 'Oncologia', 'Endocrinologia', 'Nefrologia', 'Pneumologia',
            'Reumatologia', 'Infectologia', 'Hematologia', 'Gastroenterologia'
        ]
        
        found_courses = set()
        
        # Procura pelos padrões
        for pattern in course_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                if match and len(match.strip()) > 3:
                    found_courses.add(match.strip())
        
        # Procura por cursos médicos
        for course in medical_courses:
            if course.lower() in text.lower():
                found_courses.add(course)
        
        return list(found_courses)
    
    def find_testimonials(self, text, soup):
        """Busca por depoimentos"""
        testimonials = []
        
        # Procura por seções de depoimentos
        testimonial_sections = soup.find_all(['div', 'section', 'blockquote'], 
                                              class_=re.compile(r'testimonial|depoimento|review|feedback', re.I))
        
        for section in testimonial_sections[:10]:
            testimonial_text = section.get_text(strip=True)
            if len(testimonial_text) > 30 and len(testimonial_text) < 500:
                testimonials.append(testimonial_text)
        
        return testimonials
    
    def find_contact_info(self, text, soup):
        """Extrai informações de contato"""
        contact = {
            "email": "",
            "telefone": "",
            "endereco": ""
        }
        
        # Email
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        if emails:
            contact['email'] = emails[0]
        
        # Telefone - padrões brasileiros
        phone_patterns = [
            r'(?:Tel|Telefone|WhatsApp|Fone)[:\s]*(\(?\d{2}\)?[\s\-]?\d{4,5}[\s\-]?\d{4})',
            r'(\(?\d{2}\)?[\s\-]?\d{5}[\s\-]?\d{4})',
            r'(\(?\d{2}\)?[\s\-]?\d{4}[\s\-]?\d{4})',
        ]
        
        for pattern in phone_patterns:
            phones = re.findall(pattern, text)
            for phone in phones:
                if phone and len(phone.replace(' ', '').replace('-', '').replace('(', '').replace(')', '')) >= 10:
                    contact['telefone'] = phone.strip()
                    break
            if contact['telefone']:
                break
        
        # Endereço - procura por padrões de endereço brasileiro
        address_pattern = r'(?:Endereço|Endereco|Localização|Onde estamos)[:\s]*([^\n]{10,150})'
        addresses = re.findall(address_pattern, text, re.IGNORECASE)
        if addresses:
            contact['endereco'] = addresses[0].strip()
        else:
            # Procura por CEP
            cep_pattern = r'\d{5}-?\d{3}'
            cep_matches = re.findall(cep_pattern, text)
            if cep_matches:
                # Procura texto ao redor do CEP
                for cep in cep_matches:
                    context_pattern = r'([^\n]{0,80}' + cep + r'[^\n]{0,80})'
                    contexts = re.findall(context_pattern, text)
                    if contexts:
                        contact['endereco'] = contexts[0].strip()
                        break
        
        return contact
    
    def find_differentials(self, text, soup):
        """Busca por diferenciais competitivos"""
        differentials = []
        
        # Procura por seções de diferenciais ou vantagens
        diff_keywords = [
            'diferencial', 'vantagem', 'por que', 'porquê', 'motivos', 
            'benefício', 'beneficios', 'qualidade', 'excelência',
            'reconhecido', 'certificado', 'credenciado', 'mec'
        ]
        
        # Procura por listas de vantagens
        lists = soup.find_all(['ul', 'ol'])
        for lst in lists:
            items = lst.find_all('li')
            for item in items:
                item_text = item.get_text(strip=True)
                if len(item_text) > 10 and len(item_text) < 200:
                    for keyword in diff_keywords:
                        if keyword.lower() in item_text.lower():
                            differentials.append(item_text)
                            break
        
        return list(set(differentials))[:15]
    
    def find_team(self, text, soup):
        """Busca por equipe/professores"""
        team = []
        
        # Procura por seções de equipe ou professores
        team_sections = soup.find_all(['div', 'section'], 
                                       class_=re.compile(r'team|equipe|professor|docente|corpo', re.I))
        
        for section in team_sections:
            names = section.find_all(['h3', 'h4', 'h5', 'strong', 'span'])
            for name in names:
                name_text = name.get_text(strip=True)
                # Filtro para nomes de pessoas (mais de 2 palavras, menos de 4)
                words = name_text.split()
                if 2 <= len(words) <= 4 and len(name_text) > 5 and len(name_text) < 50:
                    # Verifica se parece um nome (começa com maiúscula)
                    if name_text[0].isupper():
                        team.append(name_text)
        
        return list(set(team))[:20]
    
    def find_certifications(self, text, soup):
        """Busca por certificações e parcerias"""
        certifications = []
        
        # Procura por menções a certificações
        cert_keywords = [
            'certificado', 'certificação', 'credenciado', 'reconhecido', 'mec',
            'parceria', 'parceiro', 'convenio', 'convênio', 'accredited',
            'associado', 'membro'
        ]
        
        for keyword in cert_keywords:
            pattern = r'[^.]*\b' + keyword + r'\b[^.]*\.?'
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches[:5]:
                clean_match = match.strip()
                if len(clean_match) > 10 and len(clean_match) < 300:
                    certifications.append(clean_match)
        
        return list(set(certifications))[:10]
    
    def find_prices(self, text, soup):
        """Busca por preços e pacotes"""
        prices = {}
        
        # Procura por valores em reais
        price_pattern = r'(?:R\$\s*|RS\s*|valor\s*:?\s*)(\d+[.,]?\d*)'
        price_matches = re.findall(price_pattern, text, re.IGNORECASE)
        
        if price_matches:
            prices['valores_encontrados'] = price_matches[:10]
        
        # Procura por menções a investimento
        investment_pattern = r'(?:Investimento|Preço|Valor|Custo)[:\s]*([^\n]{5,100})'
        investments = re.findall(investment_pattern, text, re.IGNORECASE)
        if investments:
            prices['investimentos'] = [i.strip() for i in investments[:5]]
        
        return prices
    
    def find_target_audience(self, text):
        """Busca por público-alvo"""
        audience_patterns = [
            r'(?:Público-alvo|Publico-alvo|Destinado a|Para quem|Quem pode)[:\s]*([^\n]{10,200})',
            r'(?:Profissionais de|Médicos|Enfermeiros|Fisioterapeutas)[^.]*\.?',
        ]
        
        for pattern in audience_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                return matches[0].strip() if isinstance(matches[0], str) else matches[0][0].strip()
        
        return ""
    
    def scrape_page(self, url):
        """Faz scraping de uma página específica"""
        if url in self.visited_urls:
            return
        
        self.visited_urls.add(url)
        print(f"Scraping: {url}")
        
        html = self.fetch_page(url)
        if not html:
            return
        
        soup = BeautifulSoup(html, 'html.parser')
        text = self.extract_text_content(soup)
        
        # Extrai nome da instituição
        if not self.data['nome']:
            title = soup.find('title')
            if title:
                title_text = title.get_text()
                # Extrai o nome principal
                self.data['nome'] = title_text.replace(' - IPM PÓS', '').replace(' - IPM Pós-graduação', '').strip()
        
        # Extrai descrição
        if not self.data['descricao']:
            meta_desc = soup.find('meta', attrs={'name': 'description'})
            if meta_desc:
                self.data['descricao'] = meta_desc.get('content', '')
            else:
                # Tenta pegar o primeiro parágrafo significativo
                first_p = soup.find('p')
                if first_p:
                    self.data['descricao'] = first_p.get_text(strip=True)[:200]
        
        # Extrai cursos
        courses = self.find_courses(text, soup)
        for course in courses:
            if course not in self.data['cursos']:
                self.data['cursos'].append(course)
        
        # Extrai contato
        contact = self.find_contact_info(text, soup)
        if contact['email']:
            self.data['contato']['email'] = contact['email']
        if contact['telefone']:
            self.data['contato']['telefone'] = contact['telefone']
        if contact['endereco']:
            self.data['contato']['endereco'] = contact['endereco']
        
        # Extrai diferenciais
        differentials = self.find_differentials(text, soup)
        for diff in differentials:
            if diff not in self.data['diferenciais']:
                self.data['diferenciais'].append(diff)
        
        # Extrai depoimentos
        testimonials = self.find_testimonials(text, soup)
        for testimonial in testimonials:
            if testimonial not in self.data['depoimentos']:
                self.data['depoimentos'].append(testimonial)
        
        # Extrai equipe
        team = self.find_team(text, soup)
        for member in team:
            if member not in self.data['equipe']:
                self.data['equipe'].append(member)
        
        # Extrai certificações
        certifications = self.find_certifications(text, soup)
        for cert in certifications:
            if cert not in self.data['certificacoes']:
                self.data['certificacoes'].append(cert)
        
        # Extrai preços
        prices = self.find_prices(text, soup)
        if prices:
            self.data['precos'].update(prices)
        
        # Extrai público-alvo
        audience = self.find_target_audience(text)
        if audience and not self.data['publico_alvo']:
            self.data['publico_alvo'] = audience
        
        # Procura por mais links internos
        links = soup.find_all('a', href=True)
        for link in links:
            href = link['href']
            full_url = urljoin(url, href)
            parsed = urlparse(full_url)
            
            # Verifica se é link interno
            if parsed.netloc == 'ipmpos.com.br' or parsed.netloc == 'www.ipmpos.com.br':
                # Limita a páginas HTML
                if not full_url.endswith(('.pdf', '.jpg', '.png', '.gif', '.zip')):
                    if full_url not in self.visited_urls and len(self.visited_urls) < 50:
                        time.sleep(0.5)  # Delay entre requisições
                        self.scrape_page(full_url)
    
    def scrape(self):
        """Executa o scraping completo"""
        print("Iniciando scraping do IPM Pós-graduação...")
        self.scrape_page(self.base_url)
        
        # Salva os dados
        output_file = '/home/clawd/.openclaw/workspace/projects/cenbrap/concorrencia/data/raw/ipm.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(self.data, f, ensure_ascii=False, indent=2)
        
        print(f"\nScraping concluído!")
        print(f"Dados salvos em: {output_file}")
        print(f"\nResumo:")
        print(f"- Nome: {self.data['nome']}")
        print(f"- Cursos encontrados: {len(self.data['cursos'])}")
        print(f"- Depoimentos: {len(self.data['depoimentos'])}")
        print(f"- Equipe: {len(self.data['equipe'])}")
        print(f"- Certificações: {len(self.data['certificacoes'])}")

if __name__ == '__main__':
    scraper = IpmPosScraper()
    scraper.scrape()
