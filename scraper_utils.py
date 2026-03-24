#!/usr/bin/env python3
"""
Utilitários compartilhados para scrapers do projeto CENBRAP.
"""
import asyncio
from playwright.async_api import Page


async def extrair_site(page: Page, url: str, nome: str, max_chars: int = 20000) -> dict:
    """
    Extrai conteúdo de um site usando Playwright.
    
    Args:
        page: Instância do Playwright Page
        url: URL do site a ser extraído
        nome: Nome identificador do site
        max_chars: Número máximo de caracteres do conteúdo (padrão: 20000)
        
    Returns:
        Dicionário com dados extraídos do site
    """
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
            "conteudo": content[:max_chars],
            "meta": meta,
            "social_links": social_links,
            "telefones": phones[:3],
            "status": "sucesso"
        }
        
    except Exception as e:
        print(f"❌ {str(e)[:60]}")
        return {"nome": nome, "url": url, "status": "erro", "erro": str(e)}


async def criar_browser_context(playwright, headless: bool = True):
    """
    Cria um browser e contexto padrão para scraping.
    
    Args:
        playwright: Instância do Playwright
        headless: Se deve rodar em modo headless (padrão: True)
        
    Returns:
        Tupla (browser, page)
    """
    browser = await playwright.chromium.launch(headless=headless)
    context = await browser.new_context(
        user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
    )
    page = await context.new_page()
    return browser, page
