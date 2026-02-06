#!/usr/bin/env python3
"""
FASE 1: Extração completa de todos os concorrentes
"""
import asyncio
import json
from playwright.async_api import async_playwright

async def extrair_site(page, url: str, nome: str) -> dict:
    """Extrai conteúdo de um site"""
    print(f"🔍 {nome}...", end=" ", flush=True)
    
    try:
        await page.goto(url, wait_until="domcontentloaded", timeout=25000)
        await asyncio.sleep(2)
        
        title = await page.title()
        
        # Extrair texto principal
        content = await page.evaluate('''() => {
            const scripts = document.querySelectorAll('script, style, nav, footer');
            scripts.forEach(s => s.remove());
            return document.body.innerText;
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
        
        # Extrair redes sociais
        social_links = await page.evaluate('''() => {
            const links = {};
            document.querySelectorAll('a[href*="instagram.com"]').forEach(a => links.instagram = a.href);
            document.querySelectorAll('a[href*="facebook.com"]').forEach(a => links.facebook = a.href);
            document.querySelectorAll('a[href*="linkedin.com"]').forEach(a => links.linkedin = a.href);
            document.querySelectorAll('a[href*="youtube.com"]').forEach(a => links.youtube = a.href);
            document.querySelectorAll('a[href*="spotify.com"]').forEach(a => links.spotify = a.href);
            return links;
        }''')
        
        # Extrair telefones
        phones = await page.evaluate('''() => {
            const phones = [];
            document.querySelectorAll('a[href^="tel:"], a[href^="https://wa.me"]').forEach(a => {
                phones.push(a.href);
            });
            return phones;
        }''')
        
        print(f"✅ ({len(content)} chars)")
        return {
            "nome": nome,
            "url": url,
            "titulo": title,
            "conteudo": content[:25000],
            "meta": meta,
            "social_links": social_links,
            "telefones": phones[:3],
            "status": "sucesso"
        }
        
    except Exception as e:
        print(f"❌ {str(e)[:60]}")
        return {"nome": nome, "url": url, "status": "erro", "erro": str(e)}

async def main():
    # TODOS os concorrentes para extração
    concorrentes = [
        # Prioridade 1: Corrigir Einstein + Principais institucionais
        {"nome": "Einstein", "url": "https://educacao.einstein.br"},
        {"nome": "São Leopoldo Mandic", "url": "https://www.slmandic.com.br"},
        {"nome": "BWS", "url": "https://bwsead.com.br"},
        {"nome": "CDT", "url": "https://cdt.com.br"},
        
        # Prioridade 2: Outros importantes
        {"nome": "FGMed", "url": "https://fgmed.com.br"},
        {"nome": "MEV Brasil", "url": "https://mevbrasil.com.br"},
        {"nome": "Cetrus", "url": "https://cetrus.com.br"},
        {"nome": "PUC-RS", "url": "https://www.pucrs.br"},
        {"nome": "iDomed", "url": "https://idomed.com.br"},
        {"nome": "HCOR", "url": "https://www.hcor.com.br"},
        {"nome": "Sírio-Libanês", "url": "https://faculdadesiriolibanes.org.br"},
        {"nome": "IBCMED", "url": "https://ibcmed.com"},
        
        # Prioridade 3: Páginas específicas de preços
        {"nome": "Liberdade Médica - Preço", "url": "https://liberdademedicaedu.com.br/investimento"},
        {"nome": "Caduceu - Cursos", "url": "https://caduceucursos.com.br/cursos"},
    ]
    
    print(f"🚀 FASE 1: Extraindo {len(concorrentes)} sites...\n")
    
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
            await asyncio.sleep(1.5)
        
        await browser.close()
    
    # Salvar
    output = {
        "fase": "1",
        "data_extracao": "2026-02-05",
        "total": len(concorrentes),
        "resultados": resultados
    }
    
    with open("/Users/jhonatan/Repos/Análise de concorrente Cenbrap/fase1_dados.json", "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    
    sucessos = sum(1 for r in resultados if r.get("status") == "sucesso")
    print(f"\n{'='*50}")
    print(f"📊 FASE 1 Concluída: {sucessos}/{len(concorrentes)} extraídos")
    print(f"💾 Dados salvos em: fase1_dados.json")
    print(f"{'='*50}")
    
    # Listar falhas
    falhas = [r for r in resultados if r.get("status") != "sucesso"]
    if falhas:
        print("\n⚠️ Sites com erro:")
        for f in falhas:
            print(f"   - {f['nome']}: {f.get('erro', 'Erro desconhecido')[:50]}")

if __name__ == "__main__":
    asyncio.run(main())
