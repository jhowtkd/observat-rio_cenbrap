# Integração Dashboard + Dados Estudo

## 📋 Resumo

Este documento apresenta como integrar os dados da pasta `Estudo` (Agência Claw) ao dashboard existente do CENBRAP.

---

## 🎯 O que temos agora

### Dashboard Atual (`relatorio/dist/data/concorrentes.json`)
- ✅ 21 concorrentes mapeados
- ✅ Dados de preço (transparente/oculto)
- ✅ Informações básicas (site, grupo, etc.)
- ✅ Vulnerabilidades identificadas

### Dados Estudo (`Estudo/` + `dados_estendidos_dashboard.json`)
- 📊 Presença digital detalhada (seguidores, plataformas)
- 📊 Modelos de negócio categorizados
- 📊 Estratégias de conteúdo identificadas
- 📊 Framework de conteúdo dos top 5
- 📊 Oportunidades estratégicas mapeadas

---

## 💡 Sugestões de Integração

### 1. NOVA PÁGINA: "Presença Digital"

**Objetivo:** Mostrar o comparativo de presença digital entre concorrentes

**Dados a exibir:**
- Seguidores Instagram (top 5)
- Nota de presença digital (⭐ 1-5)
- Plataformas utilizadas (IG, YT, LI, TikTok, Spotify)
- Estratégia de conteúdo principal

**Visualizações sugeridas:**
```
Gráfico de barras: Top 10 por seguidores
Card: Liberdade Médica - 473K ⭐⭐⭐⭐⭐
Card: IPM - 118K (pessoal) ⭐⭐⭐⭐
Tabela: Comparativo completo
```

**Implementação:**
- Criar novo componente `PresencaDigital.tsx`
- Usar dados de `dados_estendidos_dashboard.json`
- Adicionar ao menu de navegação

---

### 2. NOVA PÁGINA: "Modelos de Negócio"

**Objetivo:** Visualizar a distribuição de modelos de negócio no mercado

**Categorias:**
| Modelo | Players | Características |
|--------|---------|-----------------|
| Personal Brand (Nicho) | Liberdade Médica, IPM | Fundador como face visível |
| Ecossistema (Inst) | Sanar, Afya | Múltiplos produtos/serviços |
| EAD Massivo | Unyleya, FGMED, IBCMED, Unyleya Med | Volume, preço baixo |
| Hands-on Premium | CDT, Cetrus, BWS | Prática real, ticket alto |
| Comunidade/Tribo | MEV Brasil | Network como diferencial |
| Hospital + Ensino | Einstein, HCOR, Sírio, iDomed | Credibilidade máxima |
| Universidade | PUCRS, Mandic | Tradição acadêmica |

**Visualizações sugeridas:**
- Gráfico de pizza: Distribuição por modelo
- Cards expansíveis: Detalhes de cada modelo
- Filtro: Ver players por categoria

---

### 3. NOVA PÁGINA: "Estratégia de Conteúdo"

**Objetivo:** Análise das estratégias de conteúdo dos top players

**Framework identificado:**
```
Educação Prática    40%  ████████████████████  3x/semana
Prova Social        25%  ████████████          2x/semana
Autoridade Pessoal  20%  █████████             2x/semana
Entretenimento      10%  █████                 1x/semana
Venda Direta         5%  ██                    1x/semana
```

**Estratégias por player:**
| Player | Estratégia | Exemplo |
|--------|------------|---------|
| Liberdade Médica | Prova Social Massiva | 473K seguidores, cases reais |
| Sanar | Multi-perfil | @sanar, @sanarflix, @sanarpos.med |
| IPM | Fundador como Influencer | Pedro Miranda 118K pessoal |
| MEV Brasil | Comunidade/Tribo | "Tribo MEV", 1.100 médicos |
| CDT | Educação Prática | Vídeos de procedimentos, e-books |

**Implementação:**
- Gráfico de rosca: Mix de conteúdo ideal
- Timeline: Calendário de conteúdo sugerido
- Cards: Exemplos de cada estratégia

---

### 4. NOVA SEÇÃO: "Oportunidades para CENBRAP"

**Objetivo:** Gaps identificados que o CENBRAP pode explorar

**Lista de oportunidades (do dossiê):**

1. **Híbrido Nicho + Institucional** ⭐ Alta
   - Gap: Ninguém combina personalidade com escala
   - Ação: Marca pessoal com estrutura institucional

2. **Garantia de Resultado** ⭐ Alta
   - Gap: Todos prometem, ninguém garante
   - Ação: "Se não aplicar na prática, devolvemos seu dinheiro"

3. **Comunidade Ativa** ⭐ Média
   - Gap: Apenas MEV tem comunidade (1.100 médicos)
   - Ação: Criar "tribo" antes mesmo do curso

4. **Conteúdo Multi-plataforma** ⭐ Média
   - Gap: Poucos usam Spotify/TikTok efetivamente
   - Ação: Podcast desde o dia 1 + shorts diários

5. **Parcerias Estratégicas** ⭐ Baixa
   - Gap: Poucos têm convênios relevantes
   - Ação: Hospitais, indústria farmacêutica

**Visualização:**
- Cards priorizados (Alta/Média/Baixa)
- Checklist de implementação
- Benchmarking por oportunidade

---

### 5. MELHORIA: Página de Detalhe do Player

**Adicionar ao modal/detalhe de cada concorrente:**

```typescript
interface PlayerDetail {
  // Dados existentes
  nome: string;
  preco: number;
  // ...
  
  // NOVOS DADOS (da pasta Estudo)
  modelo_negocio: string;
  estrategia_conteudo: string;
  presenca_digital: {
    instagram?: string;
    seguidores?: string;
    nota: number; // 1-5
  };
  diferenciais: string[];
  professores_count: number;
  comunidade?: string; // ex: "1.100+ médicos"
  produtos_count?: number;
}
```

---

## 🔧 Implementação Técnica

### Passo 1: Mesclar dados

Criar script para mesclar `concorrentes.json` + `dados_estendidos_dashboard.json`:

```python
# merge_dados.py
import json

# Carregar dados do dashboard
with open('relatorio/dist/data/concorrentes.json') as f:
    dashboard = json.load(f)

# Carregar dados estendidos
with open('dados_estendidos_dashboard.json') as f:
    estendidos = json.load(f)

# Mesclar para cada player
for player_id, dados_ext in estendidos['dados_complementares'].items():
    if player_id in dashboard['concorrentes']:
        dashboard['concorrentes'][player_id].update({
            'modelo_negocio': dados_ext['modelo_negocio'],
            'estrategia_conteudo': dados_ext['estrategia_conteudo'],
            'presenca_digital': dados_ext['presenca_digital'],
            'diferenciais_detalhados': dados_ext['diferenciais'],
        })

# Salvar
with open('relatorio/dist/data/concorrentes_enriched.json', 'w') as f:
    json.dump(dashboard, f, indent=2)
```

### Passo 2: Criar novos componentes React

```typescript
// src/components/ModelosNegocio.tsx
// src/components/PresencaDigital.tsx
// src/components/EstrategiaConteudo.tsx
// src/components/Oportunidades.tsx
```

### Passo 3: Atualizar rotas

```typescript
// src/App.tsx
<Route path="/modelos" element={<ModelosNegocio />} />
<Route path="/presenca-digital" element={<PresencaDigital />} />
<Route path="/estrategia-conteudo" element={<EstrategiaConteudo />} />
<Route path="/oportunidades" element={<Oportunidades />} />
```

---

## 📊 Novos Gráficos Sugeridos

### 1. Mapa de Posicionamento
```
Eixo X: Preço (Baixo → Alto)
Eixo Y: Digital (100% Digital → 100% Presencial)

Plotar cada player como ponto colorido por categoria
```

### 2. Radar de Presença Digital
```
Dimensões:
- Instagram
- YouTube
- LinkedIn
- TikTok
- Spotify/Podcast

Comparar CENBRAP vs Top 3 concorrentes
```

### 3. Matriz de Conteúdo
```
Heatmap: Tipo de conteúdo x Frequência

        Seg  Ter  Qua  Qui  Sex  Sáb  Dom
Educa.   █    █    █    █    █    
Prova         █         █         
Autor.             █         █    
```

---

## 🎨 Design Sugerido

### Cores por Categoria
```css
Personal Brand: #FF6B6B  (Vermelho)
Ecossistema:    #4ECDC4  (Turquesa)
EAD Massivo:    #45B7D1  (Azul)
Hands-on:       #96CEB4  (Verde)
Comunidade:     #FFEAA7  (Amarelo)
Hospital:       #DDA0DD  (Roxo)
Universidade:   #98D8C8  (Menta)
```

### Ícones
- Presença Digital: 📱
- Modelos de Negócio: 🏢
- Estratégia de Conteúdo: 📝
- Oportunidades: 💡

---

## ✅ Checklist de Implementação

- [ ] Criar script de merge dos dados
- [ ] Atualizar tipos TypeScript
- [ ] Criar componente `ModelosNegocio`
- [ ] Criar componente `PresencaDigital`
- [ ] Criar componente `EstrategiaConteudo`
- [ ] Criar componente `Oportunidades`
- [ ] Atualizar menu de navegação
- [ ] Adicionar novos gráficos
- [ ] Testar responsividade
- [ ] Documentar no README

---

## 📁 Arquivos Criados

1. `dados_estendidos_dashboard.json` - Dados consolidados da pasta Estudo
2. `INTEGRACAO_DASHBOARD_ESTUDO.md` - Este documento

---

## 🚀 Próximos Passos

1. **Revisar** este documento com a equipe
2. **Priorizar** quais páginas são mais importantes
3. **Desenvolver** os novos componentes
4. **Testar** integração dos dados
5. **Deploy** da nova versão

---

*Documento criado em: 06/02/2026*
*Fonte: Pasta Estudo - Agência Claw Digital*
