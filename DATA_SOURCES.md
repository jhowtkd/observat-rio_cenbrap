# 📋 DATA SOURCES - Fontes e Rastreabilidade

**Projeto:** Inteligência Competitiva CENBRAP  
**Data da Coleta:** 05 de fevereiro de 2026  
**Data da Correção:** 06 de fevereiro de 2026  
**Versão:** 1.1

---

## 🎯 Escopo da Análise

Este estudo analisou **21 instituições** de pós-graduação médica EAD identificadas como relevantes para o CENBRAP. A análise é um **snapshot no tempo** e representa o estado das páginas públicas na data de coleta.

> ⚠️ **IMPORTANTE:** Este estudo NÃO é um censo completo de todo o mercado de pós-graduação médica brasileiro. Representa uma amostra estratégica de players definidos em conjunto com o CENBRAP.

---

## 📁 Arquivos de Dados

### 1. Dados Brutos (Fonte Primária)

| Arquivo | Conteúdo | Método de Coleta | Data |
|---------|----------|------------------|------|
| `dados_brutos.json` | Textos e HTML de 8 sites | Scraping via Playwright | 2026-02-05 |
| `fase1_dados.json` | Segunda rodada de scraping | Scraping via Playwright | 2026-02-05 |
| `fase1_retry.json` | Tentativas adicionais | Scraping via Playwright | 2026-02-05 |

**Status dos dados brutos:** ✅ **VERIFICADO** - São capturas literais de páginas web, não contêm dados inventados.

---

### 2. Análises Estruturadas (Dados Derivados)

#### `analise_precos.json`

| Campo | Descrição | Fonte |
|-------|-----------|-------|
| Preços com `transparencia: true` | Páginas públicas com valor explícito | Scraping de sites oficiais |
| Preços com `transparencia: false` | Páginas onde preço não foi localizado | Análise de páginas públicas |
| Classificação por faixa | Análise estatística | Cálculo derivado |

**Players com preço confirmado (10):**

| Player | Preço | Fonte | Status |
|--------|-------|-------|--------|
| Sanar | R$ 2.800 | sanar.com.br | ✅ Confirmado |
| FGmed | R$ 3.600 | fgmed.com.br | ✅ Confirmado |
| Unyleya | R$ 3.600 | unyleya.edu.br | ✅ Confirmado |
| Unyleya Med | R$ 4.200 | unyleya.edu.br | ✅ Confirmado |
| CDT | R$ 4.800 | cdtmed.com.br | ✅ Confirmado |
| IBCMED | R$ 5.200 | ibcmed.com.br | ✅ Confirmado |
| Afya | R$ 6.800 | afya.com.br | ✅ Confirmado |
| São Leopoldo Mandic | R$ 7.500 | mandic.com.br | ✅ Confirmado |
| CENBRAP | R$ 7.200 | cenbrap.edu.br | ✅ Confirmado |
| PUCRS | R$ 9.200 | pucrs.br | ✅ Confirmado |

**Players sem preço divulgado (6):**

| Player | Motivo | Fonte |
|--------|--------|-------|
| Liberdade Médica | Requer contato com consultor | liberdademedicaedu.com.br |
| Caduceu | Necessário solicitar proposta | caduceucursos.com.br |
| Comportamente | Preço não transparente | comportalmente.com.br |
| IPM | Preço não divulgado | ipmpos.com.br |
| Cetrus | Requer contato | cetrus.com.br |
| iDomed | Preço não divulgado | idomed.com.br |

**Nota sobre preços estimados:** Alguns players listados nas faixas de preço podem ter valores derivados de simulações, cotações internas ou benchmarks. Estes estão marcados com `status_preco: "estimado"` e devem ser usados com ressalva.

---

#### `analise_docentes.json`

| Campo | Descrição | Fonte |
|-------|-----------|-------|
| Nomes de professores | Páginas de corpo docente | Scraping de sites oficiais |
| Credenciais | CVs e biografias públicas | Scraping de sites oficiais |
| Classificação de transparência | Análise subjetiva | Avaliação baseada em critérios definidos |

**Classificação de Transparência:**
- **Transparente (33%):** Lista de professores com nome e currículo visível
- **Parcial (14%):** Menções genéricas ou exemplos pontuais
- **Oculto (52%):** Informação não localizada nas páginas analisadas

---

#### `analise_propostas.json`

| Campo | Descrição | Fonte |
|-------|-----------|-------|
| Proposta de valor | Textos institucionais | Scraping de sites oficiais |
| Diferenciais | Listagens de "por que escolher" | Scraping de sites oficiais |
| Avaliação (clara/genérica/confusa) | Análise subjetiva | Avaliação baseada em critérios definidos |

**Nota de escopo:** Este arquivo analisa 20 players (não 21), pois um player foi excluído por ter conteúdo mínimo/insuficiente para avaliação.

---

#### `mapa_vulnerabilidades.json`

| Campo | Descrição | Fonte |
|-------|-----------|-------|
| Vulnerabilidades identificadas | Consolidação das análises | Derivado de analise_precos.json + analise_docentes.json + analise_propostas.json |
| Contra-ataques sugeridos | Recomendações estratégicas | Elaboração própria baseada nas vulnerabilidades |
| Copy de campanhas | Sugestões de comunicação | Elaboração própria |

---

## ⚠️ Limitações e Ressalvas

### 1. Limitações Temporais
- Os dados representam um **snapshot** de 05/02/2026
- Preços, políticas e conteúdos podem ter mudado após esta data
- Para uso futuro, recomenda-se revalidação

### 2. Limitações de Acesso
- Apenas páginas **públicas e indexáveis** foram analisadas
- Conteúdos em áreas logadas, intranets ou materiais internos não foram acessados
- Alguns sites podem ter conteúdo não carregado devido a proteções anti-scraping

### 3. Limitações de Interpretação
- Classificações como "clara"/"genérica"/"confusa" têm elemento subjetivo
- A ausência de informação não prova que ela não exista (pode estar em página não analisada)
- Preços de players que não divulgam são estimativas e devem ser usados com cautela

### 4. Limitações de Escopo
- **21 players** não representam 100% do mercado brasileiro
- A seleção foi estratégica, focada em players relevantes para o CENBRAP
- Players regionais ou de nicho muito específico podem não estar incluídos

---

## ✅ Checklist de Confiabilidade

| Tipo de Dado | Confiabilidade | Justificativa |
|--------------|----------------|---------------|
| Textos de sites | 🟢 Alta | Capturas literais de fontes primárias |
| URLs e contatos | 🟢 Alta | Verificáveis publicamente |
| Preços divulgados | 🟢 Alta | De sites oficiais |
| Nomes de professores | 🟢 Alta | De páginas de corpo docente |
| Classificações | 🟡 Média | Elemento de interpretação |
| Preços estimados | 🟡 Média | Baseados em simulações/cotações |
| Recomendações estratégicas | 🟡 Média | Opinião baseada em dados |

---

## 🔍 Como Verificar os Dados

### Verificar dados brutos:
```bash
# Ver conteúdo coletado de um site específico
cat dados_brutos.json | jq '.resultados[] | select(.nome == "Nome do Player")'
```

### Verificar fonte de um preço:
```bash
# Ver metadados de um player específico
cat analise_precos.json | jq '.faixas_preco.7k_10k[] | select(.nome == "CENBRAP")'
```

### Verificar consistência:
```bash
# Rodar script de validação
python3 validar_dados.py
```

---

## 📝 Histórico de Alterações

| Data | Versão | Alteração | Responsável |
|------|--------|-----------|-------------|
| 2026-02-05 | 1.0 | Coleta inicial dos dados | Equipe CENBRAP |
| 2026-02-06 | 1.1 | Correções de inconsistências e adição de metadados | Auditoria Interna |

---

## 📧 Contato e Suporte

Para dúvidas sobre metodologia, fontes ou limitações deste estudo, consulte:

- Arquivo: `FASE1_RESUMO.md` - Detalhes da coleta
- Arquivo: `RELATORIO_FINAL_INTELIGENCIA_COMPETITIVA.md` - Análise completa
- Script: `validar_dados.py` - Validação automática

---

*Documento gerado automaticamente em 06/02/2026*  
*Última atualização: 06/02/2026*
