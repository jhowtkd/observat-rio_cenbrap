# Plano de Ação - Análise de Concorrência Cenbrap

## 📋 Resumo do Projeto
**Cliente:** Cenbrap  
**Objetivo:** Dossiê completo de concorrência (20 players)  
**Entregável:** Relatório integral + auditoria de redes sociais

---

## 🎯 Concorrentes (20 total)

### Players de Nicho (4)
| # | Nome | Site | Prioridade |
|---|------|------|------------|
| 1 | Liberdade Médica | https://liberdademedicaedu.com.br | Alta |
| 2 | Caduceu | https://caduceucursos.com.br | Alta |
| 3 | Comportamente | https://comportalmente.com.br | Alta |
| 4 | IPM (Pedro Miranda) | https://ipmpos.com.br | Alta |

### Players Institucionais (16)
| # | Nome | Site | Prioridade |
|---|------|------|------------|
| 5 | Sanar | https://sanar.com.br | Média |
| 6 | FGMed | https://fgmed.org | Média |
| 7 | Unyleya | https://unyleya.edu.br | Média |
| 8 | Unyleya Med | https://unyleyamed.com.br | Média |
| 9 | Instituto CDT | https://institutocdt.com.br | Média |
| 10 | IBCMED | https://ibcmed.com | Média |
| 11 | MEV Brasil | https://mevbrasil.com.br | Média |
| 12 | Afya | https://afya.com.br | Média |
| 13 | Instituto BWS | https://institutobws.com.br | Média |
| 14 | São Leopoldo Mandic | https://slmandic.edu.br | Média |
| 15 | HCOR | https://hcor.com.br | Média |
| 16 | Einstein | https://einstein.br | Média |
| 17 | Cetrus | https://cetrus.com.br | Média |
| 18 | PUCRS | https://pucrs.br | Média |
| 19 | iDomed | https://idomed.com.br | Média |
| 20 | Sírio-Libanês | https://faculdadesiriolibanes.org.br | Média |

---

## 📊 Fases do Projeto

### FASE 1: Scraping dos Sites (Dias 1-3)
**Objetivo:** Extrair dados estruturais de todos os 20 sites

**Dados a coletar por site:**
- Nome completo da instituição
- Descrição/slogan
- Cursos oferecidos (lista completa)
- Público-alvo declarado
- Preços/pacotes (se disponível)
- Diferenciais competitivos
- Depoimentos
- Equipe/professores
- Certificações/parcerias
- Contato (email, telefone, endereço)
- Páginas principais: Home, Sobre, Cursos, Blog, Contato

**Tecnologia:** Scrapy + BeautifulSoup
**Output:** JSON estruturado por player

---

### FASE 2: Mapeamento de Redes Sociais (Dia 4)
**Objetivo:** Identificar e catalogar todas as redes sociais

**Plataformas a verificar:**
- Instagram
- LinkedIn
- Facebook
- YouTube
- TikTok
- Twitter/X

**Dados a coletar:**
- Handle/nome de usuário
- URL do perfil
- Número de seguidores
- Frequência de postagem
- Tipo de conteúdo predominante

**Tecnologia:** unbrowse (para sites) + browser (para verificação manual se necessário)
**Output:** JSON com redes sociais por player

---

### FASE 3: Auditoria de Conteúdo (Dias 5-7)
**Objetivo:** Análise qualitativa do conteúdo das redes sociais

**Métricas por plataforma:**
- **Instagram:** Posts recentes, stories, engajamento, tipo de conteúdo
- **LinkedIn:** Posts profissionais, posicionamento, recrutamento
- **YouTube:** Vídeos, views, temas abordados
- **Outras:** Análise similar conforme disponibilidade

**Análise qualitativa:**
- Tom de voz
- Frequência de publicação
- Temas principais
- Estratégia de conteúdo
- Pontos fortes/fracos

**Tecnologia:** unbrowse_replay (para APIs) ou scraping
**Output:** Relatório de auditoria por player

---

### FASE 4: Consolidação do Dossiê (Dias 8-9)
**Objetivo:** Criar documento final integrado

**Estrutura do Dossiê:**
1. **Resumo Executivo** - Panorama geral do mercado
2. **Análise por Player** - Ficha técnica de cada concorrente
3. **Análise Comparativa** - Matriz de features
4. **Benchmark de Redes Sociais** - Métricas comparativas
5. **Oportunidades e Ameaças** - SWOT do cenário
6. **Recomendações Estratégicas** - Para Cenbrap

**Output:** PDF/Markdown completo

---

## 👥 Delegações

### Agente 1: Coordinator (David Wallace - kimi-coding/k2p5)
**Responsabilidade:** Coordenar todo o projeto, validar entregáveis
**Tarefas:**
- Distribuir tarefas entre agentes
- Monitorar prazos
- Consolidar resultados
- Reportar ao Jeff

### Agente 2: Web Scraper Specialist (Dwight - Gemini Flash)
**Responsabilidade:** Fase 1 - Scraping dos sites
**Tarefas:**
- Criar spiders Scrapy para cada site
- Extrair dados estruturais
- Validar qualidade dos dados
- Entregar JSONs organizados

### Agente 3: Social Media Mapper (Jim - Qwen local)
**Responsabilidade:** Fase 2 - Mapeamento de redes sociais
**Tarefas:**
- Identificar links de redes em cada site
- Verificar presença em cada plataforma
- Catalogar métricas básicas
- Entregar mapeamento completo

### Agente 4: Content Auditor (Pam - Gemini Pro)
**Responsabilidade:** Fase 3 - Auditoria de conteúdo
**Tarefas:**
- Analisar conteúdo das redes sociais
- Avaliar estratégia de cada player
- Identificar padrões de mercado
- Entregar relatórios de auditoria

### Agente 5: Report Writer (Kevin - Gemini Flash)
**Responsabilidade:** Fase 4 - Consolidação
**Tarefas:**
- Integrar todos os dados
- Criar visualizações
- Escrever análises estratégicas
- Entregar dossiê final

---

## 📁 Estrutura de Pastas

```
projects/
└── cenbrap/
    └── concorrencia/
        ├── README.md                    # Este arquivo
        ├── data/
        │   ├── raw/                     # Dados brutos (JSONs)
        │   ├── processed/               # Dados processados
        │   └── social/                  # Dados de redes sociais
        ├── spiders/                     # Scripts Scrapy
        ├── reports/
        │   ├── individual/              # Um por player
        │   └── final/                   # Dossiê consolidado
        └── analysis/
            ├── matrices/                # Matrizes comparativas
            └── insights/                # Análises qualitativas
```

---

## ⏱️ Cronograma

| Dia | Atividade | Responsável |
|-----|-----------|-------------|
| 1 | Setup + Scraping Players Nicho (4) | Dwight |
| 2 | Scraping Players Institucionais (8) | Dwight |
| 3 | Scraping Players Institucionais (8) + Validação | Dwight |
| 4 | Mapeamento Redes Sociais (todos) | Jim |
| 5 | Auditoria Instagram + LinkedIn | Pam |
| 6 | Auditoria YouTube + Outras | Pam |
| 7 | Análise Qualitativa Consolidada | Pam |
| 8 | Consolidação Dados + Matrizes | Kevin |
| 9 | Redação Dossiê Final | Kevin |
| 10 | Revisão + Entrega | David Wallace |

---

## 🎯 Sucesso do Projeto

**Critérios de Aceitação:**
- ✅ Todos os 20 sites scrapados
- ✅ Redes sociais mapeadas
- ✅ Conteúdo auditado
- ✅ Dossiê entregue em formato profissional
- ✅ Recomendações estratégicas claras

**KPIs:**
- Cobertura: 100% dos sites
- Profundidade: mínimo 50 dados por site
- Qualidade: validação cruzada

---

## 🚀 Próximos Passos

1. **Jeff aprova** este plano
2. Criar estrutura de pastas
3. Spawn agentes especializados
4. Iniciar Fase 1

**Estimativa de tempo:** 10 dias  
**Prioridade:** Alta  
**Status:** Aguardando aprovação
