#!/usr/bin/env python3
"""
Scraper simples usando playwright
"""
import asyncio
import json
from playwright.async_api import async_playwright

async def extrair_site(page, url: str, nome: str) -> dict:
    """Extrai conteúdo de um site"""
    print(f"🔍 {nome}...", end=" ")
    
    try:
        await page.goto(url, wait_until="domcontentloaded", timeout=20000)
        await asyncio.sleep(2)  # Esperar carregar
        
        # Extrair dados básicos
        title = await page.title()
        
        # Extrair texto principal
        content = await page.evaluate('''() => {
            // Remover scripts e estilos
            const scripts = document.querySelectorAll('script, style, nav, footer');
            scripts.forEach(s => s.remove());
            
            // Pegar texto do body
            const body = document.body;
            return body.innerText;
        }''')
        
        # Extrair meta tags
        meta = await page.evaluate('''() => {
            const metas = {};
            document.querySelectorAll('meta').forEach(m => {
                const name = m.getAttribute('name') || m.getAttribute('property');
                const content = m.getAttribute('content');
                if (name && content) metas[name] = content;
            });
            return metas;
        }''')
        
        # Extrair links de redes sociais
        social_links = await page.evaluate('''() => {
            const links = {};
            document.querySelectorAll('a[href*="instagram"]').forEach(a => links.instagram = a.href);
            document.querySelectorAll('a[href*="facebook"]').forEach(a => links.facebook = a.href);
            document.querySelectorAll('a[href*="linkedin"]').forEach(a => links.linkedin = a.href);
            document.querySelectorAll('a[href*="youtube"]').forEach(a => links.youtube = a.href);
            return links;
        }''')
        
        print(f"✅ {len(content)} chars")
        return {
            "nome": nome,
            "url": url,
            "titulo": title,
            "conteudo": content[:20000],
            "meta": meta,
            "social_links": social_links,
            "status": "sucesso"
        }
        
    except Exception as e:
        print(f"❌ {str(e)[:50]}")
        return {"nome": nome, "url": url, "status": "erro", "erro": str(e)}

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
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
        )
        page = await context.new_page()
        
        resultados = []
        for c in concorrentes:
            resultado = await extrair_site(page, c["url"], c["nome"])
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
    print(f"💾 Salvo em: dados_brutos.json")

if __name__ == "__main__":
    asyncio.run(main())
