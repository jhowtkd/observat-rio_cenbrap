import scrapy
import json
from datetime import datetime

class IpmPosSpider(scrapy.Spider):
    name = 'ipmpos'
    allowed_domains = ['ipmpos.com.br']
    start_urls = ['https://ipmpos.com.br/']
    
    custom_settings = {
        'USER_AGENT': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'ROBOTSTXT_OBEY': False,
        'DOWNLOAD_DELAY': 1,
        'FEED_FORMAT': 'json',
        'FEED_ENCODING': 'utf-8',
    }
    
    def __init__(self):
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
        self.visited_pages = set()
    
    def parse(self, response):
        # Extrai dados da página principal
        self.extract_main_data(response)
        
        # Procura por links internos para outras páginas
        links = response.css('a::attr(href)').getall()
        for link in links:
            if link and 'ipmpos.com.br' in link and link not in self.visited_pages:
                self.visited_pages.add(link)
                yield scrapy.Request(url=link, callback=self.parse_page)
    
    def parse_page(self, response):
        self.extract_main_data(response)
    
    def extract_main_data(self, response):
        # Título da página
        title = response.css('title::text').get('')
        if title and not self.data['nome']:
            # Remove sufixos comuns
            self.data['nome'] = title.replace(' - IPM PÓS', '').replace(' - IPM Pós-graduação', '').strip()
        
        # Meta description
        meta_desc = response.css('meta[name="description"]::attr(content)').get('')
        if meta_desc and not self.data['descricao']:
            self.data['descricao'] = meta_desc.strip()
        
        # Extrai textos de cabeçalhos e parágrafos
        texts = response.css('h1::text, h2::text, h3::text, p::text, span::text, div::text').getall()
        full_text = ' '.join([t.strip() for t in texts if t.strip()])
        
        # Detecta cursos mencionados
        cursos_keywords = [
            'oftalmologia', 'cardiologia', 'dermatologia', 'ortopedia', 'ginecologia',
            'pediatria', 'medicina', 'enfermagem', 'fisioterapia', 'nutrição',
            'psicologia', 'odontologia', 'farmácia', 'fonoaudiologia', 'terapia',
            'pós-graduação', 'especialização', 'mba', 'latu sensu', 'stricto sensu'
        ]
        
        for keyword in cursos_keywords:
            if keyword.lower() in full_text.lower():
                # Extrai o contexto ao redor da palavra-chave
                import re
                matches = re.findall(r'[^.]*\b' + re.escape(keyword) + r'\b[^.]*\.?', full_text, re.IGNORECASE)
                for match in matches[:3]:  # Limita a 3 ocorrências por palavra-chave
                    curso = match.strip()
                    if curso and len(curso) > 10 and curso not in self.data['cursos']:
                        self.data['cursos'].append(curso)
        
        # Remove duplicatas e limita
        self.data['cursos'] = list(set(self.data['cursos']))[:30]
        
        # Detecta telefone
        import re
        phone_patterns = [
            r'\(?\d{2}\)?[\s\-]?\d{4,5}[\s\-]?\d{4}',
            r'\d{4,5}[\-\s]?\d{4}',
            r'\+?55[\s\-]?\(?\d{2}\)?[\s\-]?\d{4,5}[\s\-]?\d{4}'
        ]
        for pattern in phone_patterns:
            phones = re.findall(pattern, response.text)
            for phone in phones:
                if phone and len(phone) >= 8:
                    self.data['contato']['telefone'] = phone.strip()
                    break
            if self.data['contato']['telefone']:
                break
        
        # Detecta email
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, response.text)
        if emails:
            self.data['contato']['email'] = emails[0]
        
        # Detecta WhatsApp
        whatsapp_pattern = r'whatsapp[:\s]*(\+?\d[\d\s\-\(\)]{8,})'
        whatsapp_matches = re.findall(whatsapp_pattern, response.text, re.IGNORECASE)
        if whatsapp_matches:
            self.data['contato']['whatsapp'] = whatsapp_matches[0].strip()
    
    def closed(self, reason):
        # Salva os dados em JSON quando o spider termina
        import os
        output_dir = os.path.expanduser('~/.openclaw/workspace/projects/cenbrap/concorrencia/data/raw')
        os.makedirs(output_dir, exist_ok=True)
        
        output_file = os.path.join(output_dir, 'ipm.json')
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(self.data, f, ensure_ascii=False, indent=2)
        
        self.logger.info(f'Dados salvos em: {output_file}')
