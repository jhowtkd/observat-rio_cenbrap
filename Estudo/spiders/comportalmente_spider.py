import scrapy
import json
from datetime import datetime

class ComportalmenteSpider(scrapy.Spider):
    name = 'comportalmente'
    allowed_domains = ['comportalmente.com.br', 'www.comportalmente.com.br']
    start_urls = [
        'https://www.comportalmente.com.br/',
        'https://www.comportalmente.com.br/quem-somos',
        'https://www.comportalmente.com.br/cursos'
    ]
    
    def __init__(self):
        self.data = {
            "nome": "Comportalmente",
            "site": "https://comportalmente.com.br",
            "descricao": "",
            "cursos": [],
            "publico_alvo": "",
            "precos": {},
            "diferenciais": [],
            "depoimentos": [],
            "equipe": [],
            "certificacoes": [],
            "contato": {
                "email": "contato@comportalmente.com.br",
                "telefone": "(11) 96470-8797",
                "endereco": "Al. Rio Negro, 503 - cj 2020 - Alphaville, Barueri - SP, 06454-000"
            },
            "extraido_em": datetime.now().isoformat()
        }
        self.depoimentos_vistos = set()
    
    def parse(self, response):
        # Extrair descrição/slogan
        if response.url == 'https://www.comportalmente.com.br/' or 'www.comportalmente.com.br/' in response.url:
            # Slogan do rodapé
            slogan = response.css('footer p::text').get('')
            if slogan and 'unindo ciência' in slogan.lower():
                self.data['descricao'] = slogan.strip()
            
            # Descrição principal
            desc_principal = response.css('h1 + p::text').get('')
            if desc_principal:
                self.data['descricao'] = desc_principal.strip()
        
        # Extrair diferenciais
        diferenciais_section = response.css('[data-section-id="diferenciais"], section:contains("diferenciais"), #diferenciais')
        if diferenciais_section:
            for card in response.css('.carousel-item, .differential-card, .feature-card'):
                titulo = card.css('h3::text, h4::text, strong::text').get('')
                descricao = card.css('p::text').get('')
                if titulo and titulo not in [d['titulo'] for d in self.data['diferenciais']]:
                    self.data['diferenciais'].append({
                        'titulo': titulo.strip(),
                        'descricao': descricao.strip() if descricao else ''
                    })
        
        # Extrair cursos dos cards
        for curso in response.css('a[href*="/pos-graduacao"], .course-card, .carousel-item a'):
            nome = curso.css('::text').get('')
            if nome and 'pós-graduação' in nome.lower():
                nome_limpo = nome.replace('pós-graduação', '').replace('Inscreva-se', '').strip()
                if nome_limpo and nome_limpo not in self.data['cursos']:
                    self.data['cursos'].append(nome_limpo)
        
        # Extrair depoimentos
        for depoimento in response.css('.carousel-item, .testimonial-item'):
            texto = depoimento.css('h3::text, .quote::text, p::text').get('')
            autor = depoimento.css('text::text, .author::text').get('')
            
            if texto and len(texto) > 50:
                dep_id = texto[:50]
                if dep_id not in self.depoimentos_vistos:
                    self.depoimentos_vistos.add(dep_id)
                    self.data['depoimentos'].append({
                        'texto': texto.strip(),
                        'autor': autor.strip() if autor else ''
                    })
        
        # Extrair equipe/liderança
        if 'quem-somos' in response.url:
            for membro in response.css('strong'):
                nome = membro.css('::text').get('')
                cargo_elem = membro.xpath('following-sibling::text()').get('')
                if nome and cargo_elem:
                    cargo = cargo_elem.strip(' -')
                    if nome not in [e['nome'] for e in self.data['equipe']]:
                        self.data['equipe'].append({
                            'nome': nome,
                            'cargo': cargo
                        })
        
        # Extrair parcerias/certificações
        parcerias_text = response.css('*::text').re(r'Editora \w+|parceria|certifica\w+')
        for p in parcerias_text:
            if p not in self.data['certificacoes']:
                self.data['certificacoes'].append(p)
        
        # Seguir links para outras páginas
        for link in response.css('a::attr(href)').getall():
            if link and ('/pos-graduacao' in link or '/curso' in link):
                yield response.follow(link, callback=self.parse_curso)
    
    def parse_curso(self, response):
        # Extrair nome do curso
        nome = response.css('h1::text').get('')
        if nome and nome not in self.data['cursos']:
            self.data['cursos'].append(nome.strip())
        
        # Extrair preço se disponível
        preco = response.css('.price::text, .valor::text, [class*="preco"]::text').get('')
        if preco and nome:
            self.data['precos'][nome.strip()] = preco.strip()
    
    def closed(self, reason):
        # Salvar os dados em JSON
        with open('/home/clawd/.openclaw/workspace/projects/cenbrap/concorrencia/data/raw/comportamente.json', 'w', encoding='utf-8') as f:
            json.dump(self.data, f, ensure_ascii=False, indent=2)
        self.logger.info(f'Dados salvos em comportamente.json')
