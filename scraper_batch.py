#!/usr/bin/env python3
"""
Script para extrair conteúdo de concorrentes usando crawl4ai (sem LLM)
"""
import asyncio
import json
from crawl4ai import AsyncWebCrawler, CrawlerRunConfig, CacheMode

async def extrair_conteudo(url: str, nome: str) -> dict:
    """Extrai conteúdo markdown de um site"""
    print(f"🔍 Extraindo: {nome}")
    
    try:
        config = CrawlerRunConfig(
            cache_mode=CacheMode.BYPASS,
            page_timeout=30000,
            wait_for_images=False,
            # Extrair apenas texto principal
            excluded_tags=['nav', 'footer', 'header', 'script', 'style', 'noscript'],
        )
        
        async with AsyncWebCrawler(verbose=False) as crawler:
            result = await crawler.arun(url=url, config=config)
            
            if result.success:
                conteudo = result.markdown if hasattr(result, 'markdown') else result.html
                print(f"  ✅ {nome} - {len(conteudo)} caracteres")
                return {
                    "nome": nome,
                    "url": url,
                    "conteudo": conteudo[:15000],  # Limitar tamanho
                    "status": "sucesso",
                    "titulo": result.metadata.get('title', '') if hasattr(result, 'metadata') else ''
                }
            else:
                print(f"  ❌ {nome} - Falha")
                return {"nome": nome, "url": url, "status": "falha"}
                
    except Exception as e:
        print(f"  ❌ {nome} - Erro: {str(e)[:50]}")
        return {"nome": nome, "url": url, "status": "erro", "erro": str(e)}

async def main():
    # Lista priorizada
    concorrentes = [
        {"nome": "Liberdade Médica", "url": "https://liberdademedicaedu.com.br", "grupo": "diretos"},
        {"nome": "Caduceu", "url": "https://caduceucursos.com.br", "grupo": "diretos"},
        {"nome": "Comportamente", "url": "https://comportalmente.com.br", "grupo": "diretos"},
        {"nome": "IPM", "url": "https://ipmpos.com.br", "grupo": "diretos"},
        {"nome": "Sanar", "url": "https://www.sanar.com.br", "grupo": "institucionais"},
        {"nome": "Einstein", "url": "https://portal.einstein.br", "grupo": "institucionais"},
        {"nome": "Afya", "url": "https://afya.com.br", "grupo": "institucionais"},
        {"nome": "Unyleya", "url": "https://unyleya.edu.br", "grupo": "institucionais"},
        {"nome": "São Leopoldo Mandic", "url": "https://www.slmandic.com.br", "grupo": "institucionais"},
        {"nome": "BWS", "url": "https://bwsead.com.br", "grupo": "institucionais"},
    ]
    
    print(f"🚀 Extraindo {len(concorrentes)} sites...\n")
    
    # Executar com limite de concorrência
    semaphore = asyncio.Semaphore(4)
    
    async def extrair_limite(c):
        async with semaphore:
            return await extrair_conteudo(c["url"], c["nome"])
    
    tasks = [extrair_limite(c) for c in concorrentes]
    resultados = await asyncio.gather(*tasks)
    
    # Salvar
    output = {
        "data_extracao": "2026-02-05",
        "total": len(concorrentes),
        "resultados": resultados
    }
    
    with open("/Users/jhonatan/Repos/Análise de concorrente Cenbrap/raw_data.json", "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    
    sucessos = sum(1 for r in resultados if r.get("status") == "sucesso")
    print(f"\n📊 {sucessos}/{len(concorrentes)} extraídos com sucesso")
    print(f"💾 Dados salvos em: raw_data.json")

if __name__ == "__main__":
    asyncio.run(main())
