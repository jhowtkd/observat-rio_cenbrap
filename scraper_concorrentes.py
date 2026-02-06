#!/usr/bin/env python3
"""
Script para extrair dados de concorrentes usando crawl4ai
"""
import asyncio
import json
from crawl4ai import AsyncWebCrawler, CrawlerRunConfig, CacheMode
from crawl4ai.extraction_strategy import LLMExtractionStrategy
from pydantic import BaseModel, Field
from typing import Optional, List

# Schema para extração estruturada
class CompetitorData(BaseModel):
    nome_instituicao: str = Field(..., description="Nome completo da instituição")
    cnpj: Optional[str] = Field(None, description="CNPJ da empresa")
    credenciamento_mec: Optional[str] = Field(None, description="Status de credenciamento MEC")
    ano_fundacao: Optional[int] = Field(None, description="Ano de fundação")
    modalidades: List[str] = Field(default=[], description="Modalidades oferecidas (EAD, Presencial, etc)")
    
    # Cursos
    cursos_principais: List[str] = Field(default=[], description="Principais cursos oferecidos")
    duracao_cursos: Optional[str] = Field(None, description="Duração típica dos cursos")
    
    # Preços
    preco_transparente: bool = Field(False, description="Preço é visível no site sem cadastro")
    preco_avista: Optional[str] = Field(None, description="Valor à vista")
    preco_parcelado: Optional[str] = Field(None, description="Valor parcelado")
    valor_total: Optional[float] = Field(None, description="Valor total numérico")
    
    # Digital
    instagram_url: Optional[str] = Field(None, description="URL do Instagram")
    instagram_seguidores: Optional[str] = Field(None, description="Número de seguidores")
    facebook_url: Optional[str] = Field(None, description="URL do Facebook")
    linkedin_url: Optional[str] = Field(None, description="URL do LinkedIn")
    youtube_url: Optional[str] = Field(None, description="URL do YouTube")
    
    # Docentes
    corpo_docente_publico: bool = Field(False, description="Nomes dos professores visíveis")
    professores_destacados: List[str] = Field(default=[], description="Nomes de professores destacados")
    
    # Contato
    telefone: Optional[str] = Field(None, description="Telefone de contato")
    whatsapp: Optional[str] = Field(None, description="WhatsApp")
    email: Optional[str] = Field(None, description="Email de contato")
    cidade_sede: Optional[str] = Field(None, description="Cidade sede")

async def extrair_dados(url: str, nome: str) -> dict:
    """Extrai dados de um concorrente"""
    print(f"🔍 Extraindo: {nome} ({url})")
    
    try:
        # Configuração para extração com LLM
        extraction_strategy = LLMExtractionStrategy(
            provider="openai/gpt-4o-mini",
            api_token=None,  # Usar variável de ambiente OPENAI_API_KEY
            schema=CompetitorData.schema(),
            extraction_type="schema",
            instruction="""Extraia informações estruturadas sobre esta instituição de pós-graduação médica.
            
            Foque em:
            - Nome completo e dados institucionais (CNPJ, MEC, ano fundação)
            - Cursos oferecidos (especialidades médicas)
            - Preços (procure por valores, mensalidades, investimento)
            - Redes sociais (links e seguidores se visíveis)
            - Corpo docente (nomes de professores se listados)
            - Contato (telefone, WhatsApp, email, cidade)
            
            Se preço não estiver visível sem cadastro, marque preco_transparente como false.
            Se nomes de professores estiverem visíveis, liste-os em professores_destacados.""",
            chunk_token_threshold=2000,
            overlap_rate=0.1,
            apply_chunking=True,
            input_format="markdown",
            extra_args={"temperature": 0.0, "max_tokens": 2000}
        )
        
        config = CrawlerRunConfig(
            extraction_strategy=extraction_strategy,
            cache_mode=CacheMode.BYPASS,
            page_timeout=30000,
            wait_for_images=False,
        )
        
        async with AsyncWebCrawler(verbose=False) as crawler:
            result = await crawler.arun(
                url=url,
                config=config
            )
            
            if result.success and result.extracted_content:
                try:
                    data = json.loads(result.extracted_content)
                    print(f"  ✅ Sucesso: {nome}")
                    return {"nome": nome, "url": url, "dados": data, "status": "sucesso"}
                except json.JSONDecodeError:
                    print(f"  ⚠️ Erro ao parsear JSON: {nome}")
                    return {"nome": nome, "url": url, "dados": None, "status": "erro_parse", "raw": result.extracted_content}
            else:
                print(f"  ❌ Falha: {nome} - {result.error_message if hasattr(result, 'error_message') else 'Unknown error'}")
                return {"nome": nome, "url": url, "dados": None, "status": "falha"}
                
    except Exception as e:
        print(f"  ❌ Erro: {nome} - {str(e)}")
        return {"nome": nome, "url": url, "dados": None, "status": "erro", "erro": str(e)}

async def main():
    # Lista de concorrentes para extrair
    concorrentes = [
        # Concorrentes Diretos
        {"nome": "Liberdade Médica", "url": "https://liberdademedicaedu.com.br", "prioridade": "alta"},
        {"nome": "Caduceu", "url": "https://caduceucursos.com.br", "prioridade": "alta"},
        {"nome": "Comportamente", "url": "https://comportalmente.com.br", "prioridade": "alta"},
        {"nome": "IPM (Pedro Miranda)", "url": "https://ipmpos.com.br", "prioridade": "alta"},
        
        # Players Institucionais - Prioritários
        {"nome": "Sanar", "url": "https://sanar.com.br", "prioridade": "alta"},
        {"nome": "Einstein", "url": "https://einstein.br", "prioridade": "alta"},
        {"nome": "Afya", "url": "https://afya.com.br", "prioridade": "alta"},
        {"nome": "Unyleya", "url": "https://unyleya.edu.br", "prioridade": "alta"},
        {"nome": "São Leopoldo Mandic", "url": "https://slmandic.com.br", "prioridade": "media"},
        {"nome": "BWS", "url": "https://bwsead.com.br", "prioridade": "media"},
        {"nome": "CDT", "url": "https://cdt.com.br", "prioridade": "media"},
        {"nome": "FGMed", "url": "https://fgmed.com.br", "prioridade": "media"},
        {"nome": "MEV Brasil", "url": "https://mevbrasil.com.br", "prioridade": "media"},
        {"nome": "Cetrus", "url": "https://cetrus.com.br", "prioridade": "media"},
        {"nome": "PUC-RS", "url": "https://pucrs.br", "prioridade": "media"},
        {"nome": "iDomed", "url": "https://idomed.com.br", "prioridade": "media"},
        {"nome": "HCOR", "url": "https://hcor.com.br", "prioridade": "media"},
        {"nome": "Sírio-Libanês", "url": "https://faculdadesiriolibanes.org.br", "prioridade": "media"},
        {"nome": "IBCMED", "url": "https://ibcmed.com", "prioridade": "baixa"},
    ]
    
    print(f"🚀 Iniciando extração de {len(concorrentes)} concorrentes...\n")
    
    # Executar extrações em paralelo (com limite)
    semaphore = asyncio.Semaphore(3)  # Max 3 simultâneos
    
    async def extrair_com_limite(c):
        async with semaphore:
            return await extrair_dados(c["url"], c["nome"])
    
    tasks = [extrair_com_limite(c) for c in concorrentes]
    resultados = await asyncio.gather(*tasks)
    
    # Salvar resultados
    output = {
        "data_extracao": "2026-02-05",
        "total_concorrentes": len(concorrentes),
        "resultados": resultados
    }
    
    with open("/Users/jhonatan/Repos/Análise de concorrente Cenbrap/dados_extraidos.json", "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    
    # Estatísticas
    sucessos = sum(1 for r in resultados if r["status"] == "sucesso")
    falhas = len(resultados) - sucessos
    
    print(f"\n📊 Resumo:")
    print(f"   ✅ Sucessos: {sucessos}")
    print(f"   ❌ Falhas: {falhas}")
    print(f"\n💾 Dados salvos em: dados_extraidos.json")

if __name__ == "__main__":
    asyncio.run(main())
