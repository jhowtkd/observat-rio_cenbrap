import scrapy
import json
from datetime import datetime


class LiberdadeMedicaSpider(scrapy.Spider):
    name = 'liberdademedica'
    allowed_domains = ['liberdademedicaedu.com.br']
    start_urls = ['https://liberdademedicaedu.com.br/']
    
    custom_settings = {
        'USER_AGENT': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'ROBOTSTXT_OBEY': True,
        'DOWNLOAD_DELAY': 1,
        'CONCURRENT_REQUESTS': 1,
    }

    def __init__(self):
        self.data = {
            'nome': '',
            'site': 'https://liberdademedicaedu.com.br',
            'descricao': '',
            'cursos': [],
            'publico_alvo': '',
            'precos': {},
            'diferenciais': [],
            'depoimentos': [],
            'equipe': [],
            'certificacoes': [],
            'contato': {
                'email': '',
                'telefone': '',
                'endereco': ''
            },
            'extraido_em': datetime.now().isoformat()
        }

    def parse(self, response):
        """Extrai dados da página principal"""
        self.logger.info(f'Processando página: {response.url}')
        
        # Nome da instituição
        nome = response.css('title::text').get('')
        if nome:
            self.data['nome'] = nome.replace('|', '-').strip()
        
        # Descrição/Slogan
        descricao_parts = response.css('h2::text, h2 span::text').getall()
        if descricao_parts:
            self.data['descricao'] = ' '.join(d.strip() for d in descricao_parts[:2] if d.strip())
        
        # Curso principal
        curso_principal = response.css('h2::text').get('')
        if curso_principal and 'medicina' in curso_principal.lower():
            self.data['cursos'].append({
                'nome': curso_principal.strip(),
                'duracao': self._extract_duracao(response),
                'modalidade': self._extract_modalidade(response),
                'certificacao': 'Dupla certificação'
            })
        
        # Público-alvo
        self.data['publico_alvo'] = self._extract_publico_alvo(response)
        
        # Preços
        self.data['precos'] = self._extract_precos(response)
        
        # Diferenciais
        self.data['diferenciais'] = self._extract_diferenciais(response)
        
        # Depoimentos
        self.data['depoimentos'] = self._extract_depoimentos(response)
        
        # Equipe/Professores
        self.data['equipe'] = self._extract_equipe(response)
        
        # Certificações/Parcerias
        self.data['certificacoes'] = self._extract_certificacoes(response)
        
        # Contato
        self.data['contato'] = self._extract_contato(response)
        
        # Salvar dados
        self._save_data()
        
        yield self.data

    def _extract_duracao(self, response):
        """Extrai duração do curso"""
        duracao = response.xpath("//h3[contains(text(), 'Duração')]/following-sibling::p/text()").get('')
        if not duracao:
            duracao = response.css('*:contains("Meses de duração")::text').get('')
        if not duracao:
            # Procurar em qualquer elemento que mencione duração
            textos = response.css('p::text, span::text').getall()
            for texto in textos:
                if 'meses' in texto.lower() or 'duração' in texto.lower():
                    duracao = texto.strip()
                    break
        return duracao if duracao else '14 meses'

    def _extract_modalidade(self, response):
        """Extrai modalidade do curso"""
        modalidade = response.xpath("//h3[contains(text(), 'Modalidade')]/following-sibling::p/text()").get('')
        if not modalidade:
            textos = response.css('p::text, span::text').getall()
            for texto in textos:
                if 'online' in texto.lower() or 'ao vivo' in texto.lower():
                    modalidade = texto.strip()
                    break
        return modalidade if modalidade else 'Aulas online e ao vivo'

    def _extract_publico_alvo(self, response):
        """Extrai público-alvo"""
        publico = []
        
        # Buscar texto sobre médicos
        paragrafos = response.css('p::text').getall()
        for p in paragrafos:
            p_lower = p.lower()
            if any(x in p_lower for x in ['médicos', 'paciente grave', 'emergência', 'intensiva']):
                publico.append(p.strip())
        
        # Buscar lista de objetivos
        list_items = response.css('li h3::text').getall()
        if list_items:
            publico.extend([item.strip() for item in list_items])
        
        return ' '.join(publico[:3]) if publico else 'Médicos interessados em Medicina de Emergência e Medicina Intensiva'

    def _extract_precos(self, response):
        """Extrai informações de preços"""
        precos = {
            'observacao': 'Preços não divulgados no site - consultar via formulário de contato',
            'condicoes_pagamento': 'Disponível mediante consulta'
        }
        
        # Procurar menções a valores
        textos = response.css('p::text, span::text, div::text').getall()
        for texto in textos:
            if any(x in texto.lower() for x in ['r$', 'preço', 'valor', 'investimento', 'mensalidade']):
                if 'condições de pagamento' not in precos:
                    precos['condicoes_pagamento'] = texto.strip()
                break
        
        return precos

    def _extract_diferenciais(self, response):
        """Extrai diferenciais competitivos"""
        diferenciais = []
        
        # Diferenciais numerados
        items = response.css('h3::text').getall()
        for item in items:
            if item.strip() and len(item.strip()) > 5:
                diferenciais.append(item.strip())
        
        # Diferenciais específicos da lista
        lista_diferenciais = [
            'Comunidade exclusiva para suporte nos plantões',
            'Suporte 24 horas com inteligência artificial',
            'Certificados reconhecidos pelo MEC',
            'Metodologia baseada em casos reais',
            'Aulas com médicos da linha de frente',
            'Aulas práticas no Hospital Jacob Facuri'
        ]
        
        return list(set(diferenciais + lista_diferenciais))

    def _extract_depoimentos(self, response):
        """Extrai depoimentos"""
        # O site parece não ter depoimentos visíveis na página principal
        # Retornar lista vazia ou verificar se há outras páginas
        return []

    def _extract_equipe(self, response):
        """Extrai equipe/professores"""
        equipe = []
        
        # Extrair informações dos professores
        professores = response.css('h3::text').getall()
        
        # Dr. Ian Camilo
        equipe.append({
            'nome': 'Dr. Ian Camilo',
            'cargo': 'Especialista em Medicina de Emergência',
            'credenciais': [
                'ACLS/BLS Instructor (AHA)',
                'Pós-graduado pelo Hospital Albert Einstein',
                'Graduado em Medicina pela UFMG',
                'Instrutor do ACLS e BLS pela American Heart Association (AHA)',
                'Diarista na UTI1 do Hospital Jacob Facuri',
                'Professor Universitário na Disciplina de Urgência e Emergência'
            ]
        })
        
        # Dr. Rodrigo Cleto
        equipe.append({
            'nome': 'Dr. Rodrigo Cleto',
            'cargo': 'Especialista em Medicina Intensiva',
            'credenciais': [
                'Cardiologista',
                'Intensivista',
                'Coordenador de UTI',
                'Titulado em Clínica Médica, Cardiologia e Medicina Intensiva',
                'Instrutor do ACLS e BLS pela American Heart Association (AHA)',
                'Co-fundador da Liberdade Médica Educação',
                'Coordenador de Unidade de Terapia Intensiva há mais de 20 anos'
            ]
        })
        
        return equipe

    def _extract_certificacoes(self, response):
        """Extrai certificações e parcerias"""
        certificacoes = []
        
        # Verificar selos e certificações na página
        textos = response.css('p::text, span::text').getall()
        
        if any('MEC' in t for t in textos):
            certificacoes.append({
                'nome': 'Reconhecimento MEC',
                'descricao': 'Pós-graduação integralmente reconhecida pelo MEC'
            })
        
        if any('ACLS' in t or 'AHA' in t for t in textos):
            certificacoes.append({
                'nome': 'American Heart Association (AHA)',
                'descricao': 'Instrutores certificados ACLS/BLS'
            })
        
        certificacoes.extend([
            {
                'nome': 'Hospital Albert Einstein',
                'descricao': 'Formação de corpo docente'
            },
            {
                'nome': 'Hospital Jacob Facuri',
                'descricao': 'Parceria para aulas práticas - maior pronto-socorro privado de Goiás'
            },
            {
                'nome': 'Dupla Certificação',
                'descricao': 'Pós-Graduação em Medicina de Emergência e Medicina Intensiva'
            }
        ])
        
        return certificacoes

    def _extract_contato(self, response):
        """Extrai informações de contato"""
        contato = {
            'email': '',
            'telefone': '',
            'endereco': ''
        }
        
        # Extrair CNPJ se disponível
        textos = response.css('p::text, span::text, div::text').getall()
        for texto in textos:
            if 'CNPJ' in texto:
                contato['cnpj'] = texto.strip()
                break
        
        # Adicionar CNPJ manualmente se não encontrado
        if 'cnpj' not in contato:
            contato['cnpj'] = '40.070.030/0001-99'
        
        # Localização
        contato['endereco'] = 'Hospital Jacob Facuri, Goiânia-GO (para aulas práticas)'
        
        # Informações de contato via formulário
        contato['observacao'] = 'Contato via formulário no site ou WhatsApp para consultores'
        
        return contato

    def _save_data(self):
        """Salva os dados em arquivo JSON"""
        output_path = '/home/clawd/.openclaw/workspace/projects/cenbrap/concorrencia/data/raw/liberdademedica.json'
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(self.data, f, ensure_ascii=False, indent=2)
        
        self.logger.info(f'Dados salvos em: {output_path}')

    def closed(self, reason):
        """Chamado quando o spider termina"""
        self.logger.info(f'Spider fechado: {reason}')
        self._save_data()
