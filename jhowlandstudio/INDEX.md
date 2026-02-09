# 🤖 Agents Quick Reference

Guia rápido para escolher e executar o agente apropriado.

---

## 🎯 Matriz de Decisão Rápida

```
┌─────────────────────────────────────────────────────────────────────┐
│  PROBLEMA/SITUAÇÃO                    →  AGENTE RECOMENDADO         │
├─────────────────────────────────────────────────────────────────────┤
│  App está lenta                       →  ⚡ bolt                    │
│  Bundle size grande                   →  ⚡ bolt                    │
│  Muitas re-renders                    →  ⚡ bolt                    │
│  Queries lentas                       →  ⚡ bolt / 🗄️ database-engineer│
├─────────────────────────────────────────────────────────────────────┤
│  Vulnerabilidade encontrada           →  🛡️ sentinel               │
│  Secret hardcoded                     →  🛡️ sentinel               │
│  SQL injection possível               →  🛡️ sentinel               │
├─────────────────────────────────────────────────────────────────────┤
│  Revisar código de PR                 →  👀 code-reviewer          │
│  Validar padrões de código            →  👀 code-reviewer          │
├─────────────────────────────────────────────────────────────────────┤
│  Design de schema SQL                 →  🗄️ database-engineer     │
│  Otimizar queries                     →  🗄️ database-engineer     │
│  Modelar dados                        →  🗄️ database-engineer     │
├─────────────────────────────────────────────────────────────────────┤
│  Criar novo app/protótipo             →  🚀 rapid-prototyper       │
│  Construir feature                    →  🚀 rapid-prototyper       │
├─────────────────────────────────────────────────────────────────────┤
│  Frontend React/Vue                   →  💻 frontend-developer     │
│  API Backend                          →  🏗️ backend-architect      │
│  App mobile                           →  📱 mobile-app-builder      │
├─────────────────────────────────────────────────────────────────────┤
│  Feature com AI/ML                    →  🤖 ai-engineer            │
│  Integrar LLM                         →  🤖 ai-engineer            │
├─────────────────────────────────────────────────────────────────────┤
│  Pipeline de deploy                   →  🔄 devops-automator       │
│  Infraestrutura cloud                 →  🔄 devops-automator       │
├─────────────────────────────────────────────────────────────────────┤
│  Escrever/melhorar testes             →  🧪 test-writer-fixer      │
│  Código sem cobertura                 →  🧪 test-writer-fixer      │
├─────────────────────────────────────────────────────────────────────┤
│  Interface confusa                    →  🎨 ui-designer / palette  │
│  Problemas de acessibilidade          →  ♿ a11y-specialist         │
├─────────────────────────────────────────────────────────────────────┤
│  Pesquisar nova feature               →  🔬 researcher             │
│  Análise competitiva                  →  🔍 trend-researcher       │
├─────────────────────────────────────────────────────────────────────┤
│  Limpar código legado                 →  🧹 janitor                │
│  Migração de código                   →  🔄 migrator               │
│  Otimização geral                     →  🎯 optimizer              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🤖 Autonomous Agents

### ⚡ Bolt - Performance
**Arquivo:** `autonomous/bolt.md`

**Use quando:**
- App carrega devagar
- Bundle JS/CSS muito grande
- Componente re-renderiza sem necessidade
- Database queries ineficientes
- Usuários reclamam de lentidão

**Tipos de melhorias:**
- React.memo para prevenir re-renders
- Code splitting e lazy loading
- Database indexing
- Caching de operações caras

---

### 🛡️ Sentinel - Security
**Arquivo:** `autonomous/sentinel.md`

**Use quando:**
- Vulnerabilidade identificada
- Secret hardcoded no código
- Falta validação de input
- Sem autenticação/autorização

**Prioridades:**
1. 🚨 CRITICAL - Secrets, SQL injection, auth bypass
2. ⚠️ HIGH - XSS, CSRF, IDOR
3. 🔒 MEDIUM - Error handling
4. ✨ ENHANCEMENTS - Defense in depth

---

### 🧹 Janitor - Code Cleanup
**Arquivo:** `autonomous/janitor.md`

**Use quando:**
- Código morto para remover
- Refatoração necessária
- Débito técnico acumulado

---

## 💻 Development Agents

### 🚀 Rapid Prototyper
**Arquivo:** `development/rapid-prototyper.md`

**Use quando:**
- Criar novo app/MVP
- Validar ideia rapidamente
- Protótipo para stakeholders

**Stack preferido:**
- Frontend: React/Next.js
- Mobile: React Native/Expo
- Backend: Supabase/Firebase
- Styling: Tailwind CSS

---

### 👀 Code Reviewer
**Arquivo:** `development/code-reviewer.md`

**Use quando:**
- Revisar PR de outro dev
- Validar padrões de código
- Encontrar bugs potenciais

**Checklist:**
- [ ] Correção lógica
- [ ] Segurança
- [ ] Tratamento de erros
- [ ] Performance
- [ ] Testes
- [ ] Legibilidade

---

### 🗄️ Database Engineer
**Arquivo:** `development/database-engineer.md`

**Use quando:**
- Design de schema novo
- Queries lentas
- Modelagem de dados
- Migrações de banco

**Capacidades:**
- Schema design (SQL/NoSQL)
- Query optimization
- Index tuning
- Migration scripts

---

### 🧪 Test Writer Fixer
**Arquivo:** `development/test-writer-fixer.md`

**Use quando:**
- Código modificado precisa de testes
- Testes estão quebrando
- Cobertura de testes baixa

---

## 🎨 Design Agents

### 🎨 UI Designer
**Arquivo:** `design/ui-designer.md`

**Use quando:**
- Criar interfaces
- Design de componentes
- Sistemas de design
- Aesthetics visuais

---

### 🎨 Palette - UX Enhancement
**Arquivo:** `design/palette.md`

**Use quando:**
- Interface confusa
- Falta feedback visual
- Problemas de acessibilidade
- Estados de loading/error

---

## 📦 Product Agents

### 🔬 Researcher
**Arquivo:** `product/researcher.md`

**Use quando:**
- Pesquisar nova feature
- Avaliar upgrade de tecnologia
- Análise competitiva

---

### 🔍 Trend Researcher
**Arquivo:** `product/trend-researcher.md`

**Use quando:**
- Identificar tendências
- Oportunidades virais
- Análise de mercado

---

## 📋 Workflow Rápido

### Para Qualquer Agente:

```bash
# 1. IDENTIFICAR OPORTUNIDADE
# - Analise o codebase
# - Procure por problemas/melhorias
# - Escolha UMA com maior impacto

# 2. IMPLEMENTAR
# - Faça a mudança (< 50 linhas se possível)
# - Adicione comentários explicativos
# - Siga padrões existentes

# 3. VERIFICAR
pnpm lint
pnpm test

# 4. DOCUMENTAR
# - Crie PR com template apropriado
# - Documente o impacto
```

---

## 🔄 Combos de Agentes

### Para Nova Feature:
```
product/researcher → design/ui-designer → development/rapid-prototyper → development/test-writer-fixer → autonomous/sentinel
```

### Para Refatoração:
```
autonomous/janitor → development/code-reviewer → development/test-writer-fixer → autonomous/bolt
```

### Para Otimização:
```
autonomous/bolt → development/database-engineer → autonomous/optimizer
```

---

## ⚠️ Red Flags

Pare e reconsidere se:

🚩 Mudança > 50 linhas sem justificativa clara  
🚩 Testes quebrando e você ignora  
🚩 Breaking changes sem migration path  
🚩 Complexidade sem valor claro  
🚩 Sem oportunidade óbvia mas força PR anyway  

---

## 📊 Métricas de Sucesso

**Quantitativas:**
- [ ] Tests passing rate ≥ 95%
- [ ] Lighthouse score trending up
- [ ] Security audit clean
- [ ] Bundle size trending down

**Qualitativas:**
- [ ] User complaints trending down
- [ ] Code review feedback positive
- [ ] Team velocity maintained
- [ ] Knowledge sharing happening

---

## 🔗 Links Rápidos

| Departamento | Path |
|-------------|------|
| Autonomous | `./autonomous/` |
| Development | `./development/` |
| Design | `./design/` |
| Product | `./product/` |
| Marketing | `./marketing/` |
| Project Management | `./project-management/` |
| Studio Operations | `./studio-operations/` |
| Testing | `./testing/` |
| Bonus | `./bonus/` |

---

**Última atualização:** 2026-02-04
