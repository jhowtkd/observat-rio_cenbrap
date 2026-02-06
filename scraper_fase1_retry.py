#!/usr/bin/env python3
"""
Retry para sites que falharam na FASE 1
"""
import asyncio
import json
from playwright.async_api import async_playwright

async def extrair_site(page, url: str, nome: str) -> dict:
    print(f"🔍 {nome} ({url})...", end=" ", flush=True)
    
    try:
        await page.goto(url, wait_until="domcontentloaded", timeout=30000)
        await asyncio.sleep(3)
        
        title = await page.title()
        content = await page.evaluate('''() => document.body.innerText''')
        
        print(f"✅ ({len(content)} chars)")
        return {
            "nome": nome,
            "url": url,
            "titulo": title,
            "conteudo": content[:20000],
            "status": "sucesso"
        }
        
    except Exception as e:
        print(f"❌ {str(e)[:50]}")
        return {"nome": nome, "url": url, "status": "erro", "erro": str(e)}

async def main():
    # URLs alternativas para os que falharam
    concorrentes = [
        {"nome": "Einstein", "url": "https://www.einstein.br"},
        {"nome": "BWS", "url": "https://www.bwsedu.com.br"},
        {"nome": "FGMed", "url": "https://www.fgmed.com.br"},
        {"nome": "Einstein Medicina", "url": "https://portal.einstein.br/medicina"},
    ]
    
    print(f"🔄 RETRY FASE 1: Tentando {len(concorrentes)} URLs alternativas...\n")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
        )
        page = await context.new_page()
        
        resultados = []
        for c in concorrentes:
            resultado = await extrair_site(page, c["url"], c["nome"])
            resultados.append(resultado)
            await asyncio.sleep(2)
        
        await browser.close()
    
    # Salvar
    output = {
        "fase": "1_retry",
        "data_extracao": "2026-02-05",
        "resultados": resultados
    }
    
    with open("/Users/jhonatan/Repos/Análise de concorrente Cenbrap/fase1_retry.json", "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    
    sucessos = sum(1 for r in resultados if r.get("status") == "sucesso")
    print(f"\n✅ {sucessos}/{len(concorrentes)} sucessos no retry")

if __name__ == "__main__":
    asyncio.run(main())
