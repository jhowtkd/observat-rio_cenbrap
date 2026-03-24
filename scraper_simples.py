#!/usr/bin/env python3
"""
Scraper simples usando playwright
"""
import asyncio
import json
from playwright.async_api import async_playwright

from scraper_utils import extrair_site, criar_browser_context

async def main():
    concorrentes = [
        {"nome": "Liberdade Médica", "url": "https://liberdademedicaedu.com.br"},
        {"nome": "Caduceu", "url": "https://caduceucursos.com.br"},
        {"nome": "Comportamente", "url": "https://comportalmente.com.br"},
        {"nome": "IPM", "url": "https://ipmpos.com.br"},
        {"nome": "Sanar", "url": "https://www.sanar.com.br"},
        {"nome": "Einstein", "url": "https://portal.einstein.br"},
        {"nome": "Afya", "url": "https://afya.com.br"},
        {"nome": "Unyleya", "url": "https://unyleya.edu.br"},
    ]
    
    print(f"🚀 Extraindo {len(concorrentes)} sites...\n")
    
    async with async_playwright() as p:
        browser, page = await criar_browser_context(p)
        
        resultados = []
        for c in concorrentes:
            resultado = await extrair_site(page, c["url"], c["nome"], max_chars=20000)
            resultados.append(resultado)
            await asyncio.sleep(1)  # Delay entre requests
        
        await browser.close()
    
    # Salvar
    output = {
        "data_extracao": "2026-02-05",
        "resultados": resultados
    }
    
    with open("/Users/jhonatan/Repos/Análise de concorrente Cenbrap/dados_brutos.json", "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    
    sucessos = sum(1 for r in resultados if r.get("status") == "sucesso")
    print(f"\n📊 {sucessos}/{len(concorrentes)} extraídos")
    print("💾 Salvo em: dados_brutos.json")

if __name__ == "__main__":
    asyncio.run(main())
