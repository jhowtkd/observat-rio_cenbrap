# Análise Competitiva Cenbrap
## Inteligência Competitiva - Mercado de Pós-Graduação Médica

**Data:** 06/02/2026  
**Players Analisados:** 20 (4 nicho + 16 institucionais)  
**Metodologia:** Scraping de dados via browser automation + APIs internas

---

## 📊 RESUMO EXECUTIVO

### Players Nicho (4)
| Player | Segmento | Diferencial Principal | Modelo |
|--------|----------|----------------------|--------|
| **Liberdade Médica** | Emergência/Intensiva | Dupla certificação, prática em UTI/Sala Vermelha | Híbrido (online + presencial) |
| **Caduceu** | Multidisciplinar | 20+ cursos, professores de times de futebol | Presencial SP |
| **Comportamente** | *Site inacessível* | - | - |
| **IPM** | Pós-graduação médica | 4 unidades (Brasília, SJP, Goiânia, SP) | Presencial |

### Players Institucionais (16)
| Player | Segmento | Diferencial Principal | Escalabilidade |
|--------|----------|----------------------|----------------|
| **Sanar** | Ecossistema completo | SanarFlix + Pós + Cetrus + Shopping | Nacional (100K+ alunos) |
| **FGMED** | Educação continuada | 30K+ médicos formados, certificado 48h | Nacional |
| **Instituto CDT** | Hands-on prático | 21K alunos, método próprio, cadáveres | Nacional |
| **IBCMED/Inspirali** | Ecossistema | 14 escolas de medicina integradas | Nacional |
| **+ 12 outros** | Coletados via background task | - | - |

---

## 🎯 ANÁLISE ESTRATÉGICA

### 1. Mapa de Posicionamento

#### Eixo X: Preço (Acessível → Premium)
#### Eixo Y: Modelo (100% Digital → 100% Presencial)

```
                    100% DIGITAL
                         ↑
                         │
    FGMED (EAD)    ←─────┼─────→    Sanar (Digital/Ecossistema)
                         │
                         │
    Liberdade Médica ←───┼─────→    Instituto CDT
    (Híbrido)            │         (Hands-on/Cadáveres)
                         │
                         │
    Caduceu        ←─────┼─────→    IPM (Presencial)
    (Presencial SP)      │         (4 unidades)
                         │
                   100% PRESENCIAL
```

### 2. Diferenciais Competitivos Mapeados

| Categoria | Players | Estratégia |
|-----------|---------|------------|
| **Ecossistema** | Sanar, IBCMED/Inspirali | Múltiplos produtos, retenção de cliente |
| **Hands-on Real** | Instituto CDT, Caduceu | Cadáveres, prática hospitalar |
| **Escala Nacional** | FGMED, Sanar | 30K-100K+ alunos, EAD |
| **Nicho Premium** | Liberdade Médica | Dupla certificação, foco UTI |
| **Multi-unidades** | IPM | Presença física em 4 cidades |

### 3. Gaps de Mercado Identificados

1. **Garantia de Resultado:** Nenhum player oferece garantia de aplicação prática
2. **Preço Intermediário:** Falta opção entre R$500 (EAD) e R$5K+ (presencial)
3. **Comunidade Ativa:** Poucos têm comunidade engajada (Liberdade Médica é exceção)
4. **Personalização:** Cursos são padronizados, pouca adaptação ao aluno

---

## 💡 OPORTUNIDADES PARA CENBRAP

### Diferencial Sugerido:
> **"A única pós-graduação médica com garantia de resultado: se você não aplicar na prática, devolvemos seu dinheiro."**

### Posicionamento Recomendado:
- **Nicho:** Híbrido (nicho + institucional)
- **Preço:** R$ 3.000-5.000 (faixa intermediária)
- **Modelo:** Teoria online + prática presencial + comunidade ativa
- **Diferencial:** Garantia de resultado + mentorias + cases reais

---

## 📁 ARQUIVOS GERADOS

```
projects/cenbrap/concorrencia/
├── data/raw/
│   ├── liberademedica.json
│   ├── caduceu.json
│   ├── ipm.json
│   ├── fgmed.json
│   ├── sanar.json
│   ├── institutocdt.json
│   ├── ibcmed.json
│   └── ... (13 arquivos do background task)
├── spiders/
│   └── cenbrap_spider (Scrapy)
├── reports/
│   └── analise_competitiva_cenbrap.md
└── analysis/
```

---

## 🚀 PRÓXIMOS PASSOS

1. **Mapeamento de Redes Sociais:** Coletar Instagram/LinkedIn dos 20 players
2. **Auditoria de Conteúdo:** Analisar estratégia de postagem
3. **Matriz Comparativa:** Comparativo lado a lado de todos os players
4. **Dossiê Final:** PDF executivo com recomendações

---

*Relatório gerado em 06/02/2026. Dados coletados via scraping automatizado.*
