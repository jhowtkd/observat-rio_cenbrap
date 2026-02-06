# Plano de Alterações - Dashboard de Inteligência Competitiva

## 📋 Resumo das Observações

As observações apontam para problemas fundamentais:
1. **Dados superficiais** - Falta informações detalhadas dos concorrentes (Caduceu, Comportamente, IPM sem dados)
2. **Ausência de fontes** - Não há indicação de onde os dados foram tirados
3. **Layout caótico** - Não é um dashboard funcional, parece uma lista sem propósito
4. **Gráficos rudimentares** - Biblioteca de gráficos precisa ser mais sofisticada
5. **Sem sistema de abas** - Informações deveriam estar organizadas por concorrente em abas
6. **Cores** - Deve ser em preto
7. **Preços sem contexto** - Não está claro se são mensais, da pós toda, etc.
8. **Vulnerabilidades sem sentido** - Não explica quem apresenta nem como atacar

---

## 🎯 Estrutura de Alterações

### FASE 1: Redesenho do Layout (Dashboard Profissional)

#### 1.1 Tema Escuro Completo (Preto)
```
- Background principal: #000000 ou #0a0a0a
- Cards: #141414 ou #1a1a1a
- Bordas: rgba(255,255,255,0.08)
- Texto primário: #ffffff
- Texto secundário: #a1a1aa
- Acentos: Cyan (#06b6d4), Âmbar (#f59e0b), Verde (#10b981)
```

#### 1.2 Nova Arquitetura de Navegação (Sistema de Abas)

**Nível 1 - Visão Geral (Dashboard)**
- KPIs principais
- Gráficos executivos
- Alertas críticos

**Nível 2 - Grupos de Concorrentes (Tabs)**
```
┌─────────────────────────────────────────────────────────┐
│  [Grupo 1: Concorrentes Diretos] [Grupo 2: Institucionais]  │
│                                                          │
│  ┌──────────┬──────────┬──────────┬──────────┐           │
│  │ Liberdade │ Caduceu  │Comportam.│   IPM    │           │
│  │  Médica  │          │          │          │           │
│  └──────────┴──────────┴──────────┴──────────┘           │
│                                                          │
│  [Conteúdo detalhado do concorrente selecionado]        │
└─────────────────────────────────────────────────────────┘
```

**Nível 3 - Abas Internas por Concorrente**
- 📋 Ficha Cadastral (com fontes)
- 💰 Análise de Preços (com contexto)
- 🎯 Trafego Pago (evidências)
- 📱 Presença Digital
- ⚠️ Vulnerabilidades (com contra-ataque)
- 📊 Benchmarking

---

### FASE 2: Novos Componentes

#### 2.1 Componente: SourceBadge (Indicação de Fonte)
```tsx
interface SourceBadgeProps {
  type: 'print' | 'url' | 'video' | 'analise';
  url?: string;
  date: string;
  description: string;
}
```
- Ícone indicando tipo de fonte
- Data da coleta
- Link para evidência (quando aplicável)

#### 2.2 Componente: EvidenceGallery
- Grid de screenshots/evidências
- Modal para visualização ampliada
- Legendas explicativas

#### 2.3 Componente: VulnerabilityCard (Redesenhado)
```tsx
interface VulnerabilityCardProps {
  type: string;
  description: string;
  severity: 'alta' | 'media' | 'baixa';
  affectedCompetitors: string[];
  evidence: Evidence[];
  howToExploit: string;      // COMO ATACAR
  counterAttack: string;      // CONTRA-ATAQUE
  source: Source;
}
```

#### 2.4 Componente: PriceAnalysis (Contextualizado)
```tsx
interface PriceAnalysisProps {
  value: number;
  period: 'total' | 'monthly' | 'semester' | 'module';
  includes: string[];        // O que está incluso
  comparison: 'above_avg' | 'avg' | 'below_avg';
  source: Source;
}
```

#### 2.5 Componente: SocialLinksBlock
- Link página institucional
- Instagram (com seguidores)
- LinkedIn (com seguidores)
- Facebook (com seguidores)
- YouTube (com inscritos)

---

### FASE 3: Gráficos Sofisticados (Recharts)

Substituir Chart.js por **Recharts** para maior sofisticação visual:

#### 3.1 Gráficos Implementados:
1. **Radar Chart** - Comparativo multi-dimensional entre concorrentes
2. **Treemap** - Distribuição de investimento em ads
3. **Heatmap** - Matriz de vulnerabilidades x concorrentes
4. **Sankey** - Fluxo de funil (impressões → cliques → leads)
5. **Composed Chart** - Preço + Volume + Qualidade
6. **Bullet Chart** - Benchmarking contra média do mercado

---

### FASE 4: Atualização de Dados (JSON)

#### 4.1 Novos Campos Obrigatórios por Concorrente:

```json
{
  "id": "caduceu",
  "nome": "Caduceu",
  "fontes": {
    "site_url": "https://caduceucursos.com.br",
    "site_data_coleta": "2026-02-05",
    "meta_ads_url": "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&q=caduceu",
    "instagram_url": "https://instagram.com/caduceucursos",
    "screenshots": ["home.png", "precos.png", "ads_001.png"]
  },
  "preco": {
    "valor_total": 4200,
    "periodicidade": "total_curso",
    "duracao_curso": "24_meses",
    "valor_mensal": 175,
    "inclui_material": true,
    "inclui_certificado": true,
    "fonte": "site oficial - página de investimento",
    "data_coleta": "2026-02-05",
    "screenshot": "precos.png"
  },
  "social": {
    "site": "https://caduceucursos.com.br",
    "instagram": {
      "url": "https://instagram.com/caduceucursos",
      "handle": "@caduceucursos",
      "seguidores": "2.3k",
      "data_coleta": "2026-02-05"
    },
    "linkedin": {
      "url": "https://linkedin.com/company/caduceu",
      "seguidores": "180",
      "data_coleta": "2026-02-05"
    },
    "facebook": {
      "url": null,
      "seguidores": null
    }
  }
}
```

---

### FASE 5: Seções do Dashboard

#### 5.1 Header Executivo
```
┌─────────────────────────────────────────────────────────────────┐
│  🎯 INTELIGÊNCIA COMPETITIVA CENBRAP                    v2.0   │
│  Atualizado: 05/02/2026 | Concorrentes: 20 | Status: [AO VIVO] │
└─────────────────────────────────────────────────────────────────┘
```

#### 5.2 KPI Cards (Top Row)
- Total de Concorrentes Monitorados
- Concorrentes com Ads Ativos
- Média de Preço do Mercado
- Vulnerabilidades Críticas Identificadas
- Maior Investidor em Ads

#### 5.3 Gráficos Executivos
- **Matriz de Posicionamento**: Preço x Credibilidade (Scatter com logos)
- **Distribuição de Preços**: Histograma com benchmark
- **Radar Competitivo**: CENBRAP vs Top 3
- **Timeline de Ads**: Atividade ao longo do tempo

#### 5.4 Alertas e Oportunidades
```
┌──────────────────────────────────────────────────────────┐
│  🚨 ALERTAS CRÍTICOS                                      │
│  • Liberdade Médica aumentou investimento em 40%         │
│  • Unyleya Med lançou nova campanha em 3 formatos        │
│  • 3 concorrentes sem preço transparente                 │
├──────────────────────────────────────────────────────────┤
│  💡 OPORTUNIDADES IDENTIFICADAS                          │
│  • Gap de preço entre 3k-4k (pouca concorrência)         │
│  • Nenhum oferece garantia de 30 dias                    │
│  • 60% não mostra corpo docente                          │
└──────────────────────────────────────────────────────────┘
```

#### 5.5 Análise por Concorrente (Aba Principal)
Cada concorrente terá:

```
┌─────────────────────────────────────────────────────────────────┐
│  [LOGO] Liberdade Médica              [PRIORIDADE: ALTA]       │
│  Última atualização: 05/02/2026 | Coleta: Completa              │
├─────────────────────────────────────────────────────────────────┤
│  [📋 Ficha] [💰 Preços] [🎯 Ads] [📱 Digital] [⚠️ Vuln.]       │
│                                                                  │
│  CONTEÚDO DA ABA SELECIONADA                                    │
│  - Todas as informações com fonte                               │
│  - Screenshots de evidências                                    │
│  - Data da coleta                                               │
│  - Link para verificação                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Estrutura de Arquivos Modificada

```
relatorio/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── DashboardLayout.tsx      # Layout principal com sidebar
│   │   │   ├── Header.tsx               # Header executivo
│   │   │   ├── GroupTabs.tsx            # Tabs de grupos
│   │   │   └── CompetitorSelector.tsx   # Grid de seleção
│   │   │
│   │   ├── charts/
│   │   │   ├── RadarComparison.tsx      # Radar CENBRAP vs Concorrentes
│   │   │   ├── PriceDistribution.tsx    # Histograma de preços
│   │   │   ├── PositioningMatrix.tsx    # Matriz Preço x Credibilidade
│   │   │   ├── VulnerabilityHeatmap.tsx # Heatmap de vulnerabilidades
│   │   │   └── AdsTimeline.tsx          # Timeline de atividade
│   │   │
│   │   ├── competitor/
│   │   │   ├── CompetitorCard.tsx       # Card resumo
│   │   │   ├── CompetitorDetail.tsx     # Container detalhado
│   │   │   ├── FichaTab.tsx             # Aba ficha cadastral
│   │   │   ├── PrecoTab.tsx             # Aba de preços
│   │   │   ├── AdsTab.tsx               # Aba de tráfego pago
│   │   │   ├── DigitalTab.tsx           # Aba presença digital
│   │   │   └── VulnerabilitiesTab.tsx   # Aba vulnerabilidades
│   │   │
│   │   ├── shared/
│   │   │   ├── SourceBadge.tsx          # Badge de fonte
│   │   │   ├── EvidenceGallery.tsx      # Galeria de evidências
│   │   │   ├── SocialLinks.tsx          # Links sociais
│   │   │   ├── PriceTag.tsx             # Tag de preço contextualizada
│   │   │   ├── VulnerabilityItem.tsx    # Item de vulnerabilidade
│   │   │   └── KPICard.tsx              # Card de KPI
│   │   │
│   │   └── dashboard/
│   │       ├── KPICards.tsx             # Grid de KPIs
│   │       ├── ExecutiveCharts.tsx      # Gráficos executivos
│   │       ├── AlertsSection.tsx        # Seção de alertas
│   │       └── OpportunitiesSection.tsx # Oportunidades
│   │
│   ├── hooks/
│   │   ├── useCompetitors.ts
│   │   └── useDashboardData.ts
│   │
│   ├── types/
│   │   └── index.ts                     # Types atualizados com fontes
│   │
│   ├── utils/
│   │   ├── formatters.ts
│   │   └── chartConfig.ts
│   │
│   ├── App.tsx
│   └── index.css
│
└── public/
    ├── data/
    │   └── concorrentes.json            # Estrutura atualizada
    └── screenshots/                     # Pasta para evidências
        ├── liberdade_medica/
        │   ├── home.png
        │   ├── precos.png
        │   └── ads.png
        └── ...
```

---

## 🛠️ Dependências a Instalar

```bash
# Gráficos sofisticados
npm install recharts

# Ícones
npm install lucide-react

# Data utility
npm install date-fns

# Animações
npm install framer-motion
```

---

## 📊 Checklist de Implementação

### Sprint 1: Fundação
- [ ] Instalar dependências (recharts, lucide-react, date-fns)
- [ ] Criar tema escuro completo (preto)
- [ ] Refatorar types.ts com campos de fonte
- [ ] Criar componentes base (SourceBadge, KPICard)

### Sprint 2: Layout
- [ ] Criar DashboardLayout com sidebar
- [ ] Implementar sistema de tabs (Grupos → Concorrentes)
- [ ] Criar CompetitorSelector grid
- [ ] Implementar abas internas por concorrente

### Sprint 3: Gráficos
- [ ] Substituir Chart.js por Recharts
- [ ] Criar RadarComparison
- [ ] Criar PriceDistribution
- [ ] Criar PositioningMatrix
- [ ] Criar VulnerabilityHeatmap

### Sprint 4: Conteúdo
- [ ] Criar templates para cada aba
- [ ] Implementar EvidenceGallery
- [ ] Adicionar SocialLinks em todos os cards
- [ ] Criar VulnerabilityItem detalhado

### Sprint 5: Dados
- [ ] Atualizar concorrentes.json com fontes
- [ ] Preencher dados de Caduceu, Comportamente, IPM
- [ ] Adicionar screenshots de evidências
- [ ] Validar todas as fontes

### Sprint 6: Dashboard Executivo
- [ ] Criar KPI Cards
- [ ] Implementar AlertsSection
- [ ] Criar OpportunitiesSection
- [ ] Adicionar filtros dinâmicos

### Sprint 7: Polish
- [ ] Animações com framer-motion
- [ ] Responsividade mobile
- [ ] Testes de usabilidade
- [ ] Documentação

---

## 🎨 Guia Visual

### Paleta de Cores (Tema Preto)
```
--bg-primary: #000000
--bg-secondary: #0a0a0a
--bg-card: #141414
--bg-hover: #1f1f1f
--border: rgba(255, 255, 255, 0.08)
--text-primary: #ffffff
--text-secondary: #a1a1aa
--text-muted: #71717a
--accent-cyan: #06b6d4
--accent-amber: #f59e0b
--accent-green: #10b981
--accent-red: #ef4444
--accent-purple: #8b5cf6
```

### Tipografia
```
Fonte: Inter (mantida)
H1: 32px, bold
H2: 24px, semibold
H3: 18px, medium
Body: 14px, regular
Caption: 12px, regular (fontes/datas)
```

---

## ✅ Critérios de Aceitação

1. **Todas as informações têm fonte visível**
   - URL quando aplicável
   - Data da coleta
   - Tipo de evidência (print, vídeo, análise)

2. **Layout é um dashboard funcional**
   - KPIs visíveis no topo
   - Navegação por tabs clara
   - Gráficos interativos

3. **Dados completos para todos os concorrentes**
   - Caduceu, Comportamente, IPM preenchidos
   - Links sociais para institucionais
   - Preços contextualizados

4. **Vulnerabilidades fazem sentido**
   - Descrição clara do problema
   - Lista de afetados
   - Como explorar
   - Contra-ataque sugerido
   - Evidência anexada

5. **Visual profissional**
   - Tema preto aplicado
   - Gráficos sofisticados
   - Animações suaves
   - Responsivo

---

## ⏱️ Estimativa de Tempo

| Sprint | Tempo Estimado |
|--------|----------------|
| Sprint 1: Fundação | 4-6 horas |
| Sprint 2: Layout | 6-8 horas |
| Sprint 3: Gráficos | 4-6 horas |
| Sprint 4: Conteúdo | 4-6 horas |
| Sprint 5: Dados | 8-12 horas |
| Sprint 6: Dashboard | 4-6 horas |
| Sprint 7: Polish | 4-6 horas |
| **Total** | **34-50 horas** |

---

## 🚀 Próximos Passos Imediatos

1. **Aprovar este plano**
2. **Priorizar sprints** (quais são mais urgentes?)
3. **Confirmar acesso aos dados** - Posso acessar os sites para coletar informações faltantes?
4. **Definir estratégia de screenshots** - Onde armazenar as evidências?

---

**Autor:** Análise de Requisitos  
**Data:** 05/02/2026  
**Versão:** 1.0
