/**
 * Inteligência Competitiva CENBRAP
 * Aplicação Principal
 */

// State Management
const AppState = {
  concorrentes: [],
  grupos: {},
  filtros: {
    busca: '',
    grupo: 'todos',
    prioridade: 'todos',
    preco: 'todos',
    temAds: 'todos'
  },
  comparacao: [],
  chartInstances: {},
  visualizacaoAtual: 'grid'
};

// Inicialização
async function init() {
  try {
    await carregarDados();
    renderizarDashboard();
    setupEventListeners();
    inicializarGraficos();
    atualizarData();
  } catch (error) {
    console.error('Erro ao inicializar:', error);
    mostrarErro('Falha ao carregar dados. Recarregue a página.');
  }
}

// Carregar dados do JSON
async function carregarDados() {
  try {
    const response = await fetch('data/concorrentes.json');
    const data = await response.json();
    
    AppState.concorrentes = Object.values(data.concorrentes);
    AppState.grupos = data.grupos;
    AppState.analiseGeral = data.analise_geral;
    
    // Calcular estatísticas gerais
    calcularEstatisticas();
    
    // Disparar evento de dados carregados
    document.dispatchEvent(new CustomEvent('dataLoaded'));
    
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    throw error;
  }
}

// Calcular estatísticas
function calcularEstatisticas() {
  const stats = {
    total: AppState.concorrentes.length,
    comMEC: AppState.concorrentes.filter(c => 
      c.ficha_cadastral?.credenciamento_mec?.toLowerCase().includes('credenciada')
    ).length,
    comTransparencia: AppState.concorrentes.filter(c => 
      c.autoridade?.corpo_docente_publico === true
    ).length,
    comAds: AppState.concorrentes.filter(c => 
      c.trafego_pago?.meta_ads?.anuncios_ativos > 0
    ).length,
    precoMedio: 0,
    totalVulnerabilidades: AppState.concorrentes.reduce((acc, c) => 
      acc + (c.vulnerabilidades?.length || 0), 0
    ),
    grupos: {}
  };
  
  // Calcular preço médio
  const precos = AppState.concorrentes
    .filter(c => c.oferta?.valor_total)
    .map(c => c.oferta.valor_total);
  
  if (precos.length > 0) {
    stats.precoMedio = Math.round(precos.reduce((a, b) => a + b, 0) / precos.length);
  }
  
  // Contar por grupo
  Object.keys(AppState.grupos).forEach(grupoKey => {
    const grupo = AppState.grupos[grupoKey];
    stats.grupos[grupoKey] = {
      nome: grupo.nome,
      count: grupo.concorrentes.length
    };
  });
  
  AppState.estatisticas = stats;
}

// Renderizar Dashboard
function renderizarDashboard() {
  renderizarStats();
  renderizarFiltros();
  renderizarConcorrentes();
  renderizarMatrizComparativa();
  renderizarVulnerabilidades();
  renderizarInsights();
}

// Renderizar Estatísticas
function renderizarStats() {
  const statsContainer = document.getElementById('stats-container');
  if (!statsContainer) return;
  
  const stats = AppState.estatisticas;
  
  statsContainer.innerHTML = `
    <div class="card stat-card fade-in">
      <div class="stat-value">${stats.total}</div>
      <div class="stat-label">Concorrentes Analisados</div>
    </div>
    <div class="card stat-card fade-in" style="animation-delay: 0.1s">
      <div class="stat-value amber" id="stat-ads">${stats.comAds || '--'}</div>
      <div class="stat-label">Com Anúncios Ativos</div>
    </div>
    <div class="card stat-card fade-in" style="animation-delay: 0.2s">
      <div class="stat-value" id="stat-vuln">${stats.totalVulnerabilidades}</div>
      <div class="stat-label">Vulnerabilidades</div>
    </div>
    <div class="card stat-card fade-in" style="animation-delay: 0.3s">
      <div class="stat-value emerald" id="stat-mec">${stats.comMEC}</div>
      <div class="stat-label">Credenciadas MEC</div>
    </div>
  `;
}

// Renderizar Filtros
function renderizarFiltros() {
  const filtersContainer = document.getElementById('filters-container');
  if (!filtersContainer) return;
  
  filtersContainer.innerHTML = `
    <div class="search-box filter-group">
      <label>Buscar</label>
      <input type="text" class="input" id="search-input" placeholder="Nome, URL, palavra-chave...">
    </div>
    
    <div class="filter-group">
      <label>Grupo</label>
      <select class="input select" id="filter-grupo">
        <option value="todos">Todos os grupos</option>
        <option value="diretos">Concorrentes Diretos</option>
        <option value="institucionais">Players Institucionais</option>
      </select>
    </div>
    
    <div class="filter-group">
      <label>Prioridade</label>
      <select class="input select" id="filter-prioridade">
        <option value="todos">Todas</option>
        <option value="alta">Alta</option>
        <option value="media">Média</option>
        <option value="baixa">Baixa</option>
      </select>
    </div>
    
    <div class="filter-group">
      <label>Tráfego Pago</label>
      <select class="input select" id="filter-ads">
        <option value="todos">Todos</option>
        <option value="sim">Com anúncios</option>
        <option value="nao">Sem anúncios</option>
      </select>
    </div>
  `;
}

// Renderizar Concorrentes
function renderizarConcorrentes() {
  const container1 = document.getElementById('grupo1-content');
  const container2 = document.getElementById('grupo2-content');
  
  if (!container1 || !container2) return;
  
  // Filtrar concorrentes
  const concorrentesFiltrados = filtrarConcorrentes();
  
  // Separar por grupo
  const grupo1 = concorrentesFiltrados.filter(c => c.grupo === 'diretos');
  const grupo2 = concorrentesFiltrados.filter(c => c.grupo === 'institucionais');
  
  // Renderizar cada grupo
  container1.innerHTML = grupo1.length > 0 
    ? grupo1.map((c, i) => renderizarCardConcorrente(c, i)).join('')
    : renderizarEmptyState('Nenhum concorrente encontrado');
    
  container2.innerHTML = grupo2.length > 0 
    ? grupo2.map((c, i) => renderizarCardConcorrente(c, i + grupo1.length)).join('')
    : renderizarEmptyState('Nenhum concorrente encontrado');
  
  // Adicionar event listeners aos cards
  adicionarEventListenersCards();
}

// Filtrar concorrentes
function filtrarConcorrentes() {
  return AppState.concorrentes.filter(c => {
    // Filtro de busca
    if (AppState.filtros.busca) {
      const busca = AppState.filtros.busca.toLowerCase();
      const match = c.nome.toLowerCase().includes(busca) ||
                   c.url?.toLowerCase().includes(busca) ||
                   c.posicionamento?.headline?.toLowerCase().includes(busca);
      if (!match) return false;
    }
    
    // Filtro de grupo
    if (AppState.filtros.grupo !== 'todos' && c.grupo !== AppState.filtros.grupo) {
      return false;
    }
    
    // Filtro de prioridade
    if (AppState.filtros.prioridade !== 'todos' && c.prioridade !== AppState.filtros.prioridade) {
      return false;
    }
    
    // Filtro de ads
    if (AppState.filtros.temAds !== 'todos') {
      const temAds = c.trafego_pago?.meta_ads?.anuncios_ativos > 0;
      if (AppState.filtros.temAds === 'sim' && !temAds) return false;
      if (AppState.filtros.temAds === 'nao' && temAds) return false;
    }
    
    return true;
  });
}

// Renderizar card de concorrente
function renderizarCardConcorrente(concorrente, index) {
  const iniciais = concorrente.nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const isSelected = AppState.comparacao.includes(concorrente.id);
  
  const preco = concorrente.oferta?.valor_total 
    ? `R$ ${concorrente.oferta.valor_total.toLocaleString()}` 
    : 'N/A';
  
  const adsCount = concorrente.trafego_pago?.meta_ads?.anuncios_ativos || 0;
  const vulnerabilidades = concorrente.vulnerabilidades?.length || 0;
  
  return `
    <div class="competitor-card ${isSelected ? 'selected' : ''}" data-id="${concorrente.id}" style="animation-delay: ${index * 0.05}s">
      <div class="competitor-header" onclick="toggleExpand('${concorrente.id}')">
        <div class="competitor-header-main">
          <div class="competitor-logo">${iniciais}</div>
          <div class="competitor-info">
            <h3>${concorrente.nome}</h3>
            <div class="competitor-url">${concorrente.url || 'URL não disponível'}</div>
            <div class="competitor-badges">
              <span class="tag tag-${concorrente.prioridade === 'alta' ? 'red' : concorrente.prioridade === 'media' ? 'amber' : 'blue'}">
                ${concorrente.prioridade}
              </span>
              ${concorrente.ficha_cadastral?.credenciamento_mec?.includes('Credenciada') 
                ? '<span class="tag tag-emerald">MEC ✓</span>' 
                : '<span class="tag">MEC ?</span>'}
              ${adsCount > 0 ? `<span class="tag tag-purple">${adsCount} ads</span>` : ''}
              ${vulnerabilidades > 0 ? `<span class="tag tag-red">${vulnerabilidades} vulner.</span>` : ''}
            </div>
          </div>
        </div>
        <div class="competitor-actions" onclick="event.stopPropagation()">
          <button class="btn btn-secondary btn-sm" onclick="toggleComparacao('${concorrente.id}')" title="Adicionar à comparação">
            ${isSelected ? '✓' : '⚖️'}
          </button>
          <button class="btn btn-ghost btn-sm" onclick="toggleExpand('${concorrente.id}')" title="Expandir">
            ▼
          </button>
        </div>
      </div>
      
      <div class="competitor-body">
        <div class="competitor-summary">
          <div class="competitor-metric">
            <span class="competitor-metric-label">💰 Preço</span>
            <span class="competitor-metric-value">${preco}</span>
          </div>
          <div class="competitor-metric">
            <span class="competitor-metric-label">📱 Instagram</span>
            <span class="competitor-metric-value">${concorrente.digital?.instagram?.seguidores || 'N/A'}</span>
          </div>
          <div class="competitor-metric">
            <span class="competitor-metric-label">🎯 Anúncios</span>
            <span class="competitor-metric-value">${adsCount > 0 ? `${adsCount} ativos` : 'N/A'}</span>
          </div>
          <div class="competitor-metric">
            <span class="competitor-metric-label">⚠️ Vulnerabilidades</span>
            <span class="competitor-metric-value ${vulnerabilidades > 0 ? 'negative' : 'positive'}">
              ${vulnerabilidades > 0 ? vulnerabilidades : 'Nenhuma'}
            </span>
          </div>
        </div>
        
        ${concorrente.posicionamento?.headline ? `
          <div class="quote" style="margin-top: var(--space-lg)">
            "${concorrente.posicionamento.headline}"
            <div class="quote-source">Headline principal</div>
          </div>
        ` : ''}
        
        <!-- Detail View (Initially Hidden) -->
        <div class="competitor-detail" id="detail-${concorrente.id}">
          ${renderizarAbasConcorrente(concorrente)}
        </div>
      </div>
    </div>
  `;
}

// Renderizar abas do concorrente
function renderizarAbasConcorrente(concorrente) {
  return `
    <div class="competitor-tabs">
      <div class="competitor-tab active" onclick="switchTab('${concorrente.id}', 'overview')">Overview</div>
      <div class="competitor-tab" onclick="switchTab('${concorrente.id}', 'ficha')">📋 Ficha</div>
      <div class="competitor-tab" onclick="switchTab('${concorrente.id}', 'oferta')">💰 Oferta</div>
      <div class="competitor-tab" onclick="switchTab('${concorrente.id}', 'digital')">📱 Digital</div>
      <div class="competitor-tab" onclick="switchTab('${concorrente.id}', 'ads')">🎯 Ads</div>
      <div class="competitor-tab" onclick="switchTab('${concorrente.id}', 'swot')">📊 SWOT</div>
    </div>
    
    <div class="competitor-tab-content active" id="tab-${concorrente.id}-overview">
      ${renderizarOverview(concorrente)}
    </div>
    
    <div class="competitor-tab-content" id="tab-${concorrente.id}-ficha">
      ${renderizarFichaTecnica(concorrente)}
    </div>
    
    <div class="competitor-tab-content" id="tab-${concorrente.id}-oferta">
      ${renderizarOferta(concorrente)}
    </div>
    
    <div class="competitor-tab-content" id="tab-${concorrente.id}-digital">
      ${renderizarDigital(concorrente)}
    </div>
    
    <div class="competitor-tab-content" id="tab-${concorrente.id}-ads">
      ${renderizarAds(concorrente)}
    </div>
    
    <div class="competitor-tab-content" id="tab-${concorrente.id}-swot">
      ${renderizarSWOT(concorrente)}
    </div>
  `;
}

// Renderizar Overview
function renderizarOverview(concorrente) {
  const v = concorrente.vulnerabilidades || [];
  
  return `
    <div class="data-grid">
      <div class="data-section">
        <div class="data-section-title">🎯 Posicionamento</div>
        <div class="data-row">
          <span class="data-label">Headline</span>
          <span class="data-value">${concorrente.posicionamento?.headline || 'N/A'}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Tom de Voz</span>
          <span class="data-value">${concorrente.posicionamento?.tom_de_voz || 'N/A'}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Diferenciais</span>
          <span class="data-value">${concorrente.posicionamento?.diferenciais_declarados?.join(', ') || 'N/A'}</span>
        </div>
      </div>
      
      <div class="data-section">
        <div class="data-section-title">⚠️ Vulnerabilidades (${v.length})</div>
        ${v.length > 0 ? v.map(vuln => `
          <div style="padding: var(--space-sm) 0; border-bottom: 1px solid var(--border-subtle);">
            <div style="font-weight: 600; font-size: 0.875rem; margin-bottom: var(--space-xs);">
              ${vuln.tipo}
            </div>
            <div style="font-size: 0.875rem; color: var(--text-secondary);">
              ${vuln.descricao}
            </div>
          </div>
        `).join('') : '<p style="color: var(--text-muted); font-size: 0.875rem;">Nenhuma vulnerabilidade identificada</p>'}
      </div>
    </div>
  `;
}

// Renderizar Ficha Técnica
function renderizarFichaTecnica(concorrente) {
  const f = concorrente.ficha_cadastral || {};
  
  return `
    <div class="data-grid">
      <div class="data-section">
        <div class="data-section-title">🏢 Institucional</div>
        <div class="data-row">
          <span class="data-label">Nome Completo</span>
          <span class="data-value">${f.nome_completo || 'N/A'}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Natureza Jurídica</span>
          <span class="data-value">${f.natureza_juridica || 'N/A'}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Credenciamento MEC</span>
          <span class="data-value ${f.credenciamento_mec?.includes('Credenciada') ? 'positive' : 'warning'}">
            ${f.credenciamento_mec || 'N/A'}
          </span>
        </div>
        <div class="data-row">
          <span class="data-label">Ano de Fundação</span>
          <span class="data-value">${f.ano_fundacao || 'N/A'}</span>
        </div>
      </div>
      
      <div class="data-section">
        <div class="data-section-title">📚 Operacional</div>
        <div class="data-row">
          <span class="data-label">Modalidade</span>
          <span class="data-value">${f.modalidade?.join(', ') || 'N/A'}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Especialidades</span>
          <span class="data-value">${f.especialidades?.join(', ') || 'N/A'}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Alunos Formados</span>
          <span class="data-value">${f.alunos_formados || 'N/A'}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Sede</span>
          <span class="data-value">${f.sede || 'N/A'}</span>
        </div>
      </div>
      
      <div class="data-section">
        <div class="data-section-title">👨‍🏫 Autoridade</div>
        <div class="data-row">
          <span class="data-label">Corpo Docente Público</span>
          <span class="data-value ${concorrente.autoridade?.corpo_docente_publico ? 'positive' : 'negative'}">
            ${concorrente.autoridade?.corpo_docente_publico ? 'Sim ✓' : 'Não ✗'}
          </span>
        </div>
        <div class="data-row">
          <span class="data-label">Professores Destacados</span>
          <span class="data-value">${concorrente.autoridade?.professores_destacados?.join(', ') || 'N/A'}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Parcerias</span>
          <span class="data-value">${concorrente.autoridade?.parcerias?.join(', ') || 'N/A'}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Certificações</span>
          <span class="data-value">${concorrente.autoridade?.certificacoes?.join(', ') || 'N/A'}</span>
        </div>
      </div>
    </div>
  `;
}

// Renderizar Oferta
function renderizarOferta(concorrente) {
  const o = concorrente.oferta || {};
  
  return `
    <div class="data-grid">
      <div class="data-section">
        <div class="data-section-title">💰 Preço</div>
        <div class="data-row">
          <span class="data-label">Preço à Vista</span>
          <span class="data-value">${o.preco_avista || 'N/A'}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Preço Parcelado</span>
          <span class="data-value">${o.preco_parcelado || 'N/A'}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Valor Total</span>
          <span class="data-value">${o.valor_total ? `R$ ${o.valor_total.toLocaleString()}` : 'N/A'}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Desconto à Vista</span>
          <span class="data-value">${o.desconto_a_vista || 'N/A'}</span>
        </div>
      </div>
      
      <div class="data-section">
        <div class="data-section-title">🎁 Condições</div>
        <div class="data-row">
          <span class="data-label">Garantia</span>
          <span class="data-value">${o.garantia || 'N/A'}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Parcelamento Máx</span>
          <span class="data-value">${o.parcelamento_max ? `${o.parcelamento_max}x` : 'N/A'}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Preço Transparente</span>
          <span class="data-value ${o.preco_transparente ? 'positive' : 'negative'}">
            ${o.preco_transparente ? 'Sim ✓' : 'Não ✗'}
          </span>
        </div>
        <div class="data-row">
          <span class="data-label">Bônus Inclusos</span>
          <span class="data-value">${o.bonus_inclusos?.join(', ') || 'N/A'}</span>
        </div>
      </div>
      
      <div class="data-section">
        <div class="data-section-title">🛒 Landing Page</div>
        <div class="data-row">
          <span class="data-label">Headline</span>
          <span class="data-value">${concorrente.landing_page?.headline || 'N/A'}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Vídeo de Vendas</span>
          <span class="data-value">${concorrente.landing_page?.video_vendas?.tem ? 'Sim' : 'Não'}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Prova Social</span>
          <span class="data-value">${concorrente.landing_page?.prova_social?.tipo || 'N/A'}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Escassez</span>
          <span class="data-value">${concorrente.landing_page?.escassez || 'N/A'}</span>
        </div>
      </div>
    </div>
  `;
}

// Renderizar Digital
function renderizarDigital(concorrente) {
  const d = concorrente.digital || {};
  
  return `
    <div class="social-grid">
      <div class="social-card">
        <div class="social-header">
          <div class="social-icon instagram">📸</div>
          <div class="social-info">
            <h4>Instagram</h4>
            <span>@${d.instagram?.handle || 'N/A'}</span>
          </div>
        </div>
        <div class="social-stats">
          <div class="social-stat">
            <div class="social-stat-value">${d.instagram?.seguidores || 'N/A'}</div>
            <div class="social-stat-label">Seguidores</div>
          </div>
          <div class="social-stat">
            <div class="social-stat-value">${d.instagram?.engajamento || 'N/A'}</div>
            <div class="social-stat-label">Engajamento</div>
          </div>
          <div class="social-stat">
            <div class="social-stat-value">${d.instagram?.frequencia_posts || 'N/A'}</div>
            <div class="social-stat-label">Frequência</div>
          </div>
        </div>
        ${d.instagram?.url ? `
          <div style="padding: 0 var(--space-md) var(--space-md)">
            <a href="${d.instagram.url}" target="_blank" class="btn btn-secondary btn-sm" style="width: 100%">
              Ver Perfil →
            </a>
          </div>
        ` : ''}
      </div>
      
      <div class="social-card">
        <div class="social-header">
          <div class="social-icon facebook">f</div>
          <div class="social-info">
            <h4>Facebook</h4>
            <span>${d.facebook?.seguidores || 'N/A'} seguidores</span>
          </div>
        </div>
      </div>
      
      <div class="social-card">
        <div class="social-header">
          <div class="social-icon linkededin">in</div>
          <div class="social-info">
            <h4>LinkedIn</h4>
            <span>${d.linkedin?.seguidores || 'N/A'} seguidores</span>
          </div>
        </div>
      </div>
      
      <div class="social-card">
        <div class="social-header">
          <div class="social-icon youtube">▶</div>
          <div class="social-info">
            <h4>YouTube</h4>
            <span>${d.youtube?.inscritos || 'N/A'} inscritos</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="data-section" style="margin-top: var(--space-lg)">
      <div class="data-section-title">📊 Presença Orgânica</div>
      <div class="data-row">
        <span class="data-label">SEO Orgânico</span>
        <span class="data-value">${d.seo_organico || 'N/A'}</span>
      </div>
      <div class="data-row">
        <span class="data-label">Blog</span>
        <span class="data-value">${d.blog ? 'Sim' : 'Não'}</span>
      </div>
    </div>
  `;
}

// Renderizar Ads
function renderizarAds(concorrente) {
  const ads = concorrente.trafego_pago?.meta_ads || {};
  const google = concorrente.trafego_pago?.google_ads || {};
  
  return `
    <div class="data-grid">
      <div class="data-section">
        <div class="data-section-title">📘 Meta Ads</div>
        <div class="data-row">
          <span class="data-label">Anúncios Ativos</span>
          <span class="data-value">${ads.anuncios_ativos || 'N/A'}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Investimento Estimado</span>
          <span class="data-value">${ads.investimento_estimado || 'N/A'}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Formatos</span>
          <span class="data-value">${ads.formatos?.join(', ') || 'N/A'}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Ângulos de Copy</span>
          <span class="data-value">${ads.angulos_copy?.join(', ') || 'N/A'}</span>
        </div>
      </div>
      
      <div class="data-section">
        <div class="data-section-title">🔍 Google Ads</div>
        <div class="data-row">
          <span class="data-label">Anúncios Ativos</span>
          <span class="data-value">${google.anuncios_ativos ? 'Sim' : 'Não'}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Palavras-chave</span>
          <span class="data-value">${google.palavras_chave?.join(', ') || 'N/A'}</span>
        </div>
      </div>
    </div>
    
    ${ads.anuncios_ativos > 0 ? `
      <div class="data-section" style="margin-top: var(--space-lg)">
        <div class="data-section-title">📸 Screenshots de Anúncios</div>
        <div class="screenshot-gallery">
          <div class="screenshot-item skeleton"></div>
          <div class="screenshot-item skeleton"></div>
          <div class="screenshot-item skeleton"></div>
        </div>
      </div>
    ` : ''}
  `;
}

// Renderizar SWOT
function renderizarSWOT(concorrente) {
  const swot = concorrente.swot || {};
  
  return `
    <div class="swot-grid">
      <div class="swot-quadrant forcas">
        <div class="swot-title">💪 Forças</div>
        <ul class="swot-list">
          ${swot.forcas?.length > 0 
            ? swot.forcas.map(f => `<li>${f}</li>`).join('') 
            : '<li style="opacity: 0.5">Nenhuma força documentada</li>'}
        </ul>
      </div>
      
      <div class="swot-quadrant fraquezas">
        <div class="swot-title">⚠️ Fraquezas</div>
        <ul class="swot-list">
          ${swot.fraquezas?.length > 0 
            ? swot.fraquezas.map(f => `<li>${f}</li>`).join('') 
            : '<li style="opacity: 0.5">Nenhuma fraqueza documentada</li>'}
        </ul>
      </div>
      
      <div class="swot-quadrant oportunidades">
        <div class="swot-title">🚀 Oportunidades</div>
        <ul class="swot-list">
          ${swot.oportunidades?.length > 0 
            ? swot.oportunidades.map(o => `<li>${o}</li>`).join('') 
            : '<li style="opacity: 0.5">Nenhuma oportunidade documentada</li>'}
        </ul>
      </div>
      
      <div class="swot-quadrant ameacas">
        <div class="swot-title">⚡ Ameaças</div>
        <ul class="swot-list">
          ${swot.ameacas?.length > 0 
            ? swot.ameacas.map(a => `<li>${a}</li>`).join('') 
            : '<li style="opacity: 0.5">Nenhuma ameaça documentada</li>'}
        </ul>
      </div>
    </div>
  `;
}

// Renderizar Matriz Comparativa
function renderizarMatrizComparativa() {
  const container = document.getElementById('matriz-content');
  if (!container) return;
  
  const concorrentesComDados = AppState.concorrentes.filter(c => c.status_coleta !== 'pendente');
  
  if (concorrentesComDados.length === 0) {
    container.innerHTML = renderizarEmptyState('Dados em coleta...');
    return;
  }
  
  container.innerHTML = `
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Concorrente</th>
            <th>Grupo</th>
            <th>MEC</th>
            <th>Preço</th>
            <th>Docente Público</th>
            <th>Anúncios</th>
            <th>Vulnerabilidades</th>
          </tr>
        </thead>
        <tbody>
          ${concorrentesComDados.map(c => `
            <tr>
              <td><strong>${c.nome}</strong></td>
              <td><span class="tag tag-${c.grupo === 'diretos' ? 'amber' : 'blue'}">${c.grupo === 'diretos' ? 'Direto' : 'Institucional'}</span></td>
              <td>${c.ficha_cadastral?.credenciamento_mec?.includes('Credenciada') ? '✓' : '?'}</td>
              <td>${c.oferta?.valor_total ? `R$ ${c.oferta.valor_total.toLocaleString()}` : 'N/A'}</td>
              <td>${c.autoridade?.corpo_docente_publico ? '✓' : '✗'}</td>
              <td>${c.trafego_pago?.meta_ads?.anuncios_ativos || 0}</td>
              <td>${c.vulnerabilidades?.length || 0}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// Renderizar Vulnerabilidades
function renderizarVulnerabilidades() {
  const container = document.getElementById('vulnerabilidades-content');
  if (!container) return;
  
  // Coletar todas as vulnerabilidades
  const todasVulnerabilidades = AppState.concorrentes.flatMap(c => 
    (c.vulnerabilidades || []).map(v => ({...v, concorrente: c.nome}))
  );
  
  if (todasVulnerabilidades.length === 0) {
    container.innerHTML = renderizarEmptyState('Nenhuma vulnerabilidade documentada ainda');
    return;
  }
  
  // Agrupar por tipo
  const porTipo = {};
  todasVulnerabilidades.forEach(v => {
    if (!porTipo[v.tipo]) porTipo[v.tipo] = [];
    porTipo[v.tipo].push(v);
  });
  
  container.innerHTML = `
    <div class="vulnerability-list">
      ${Object.entries(porTipo).map(([tipo, vulns]) => `
        <div class="vulnerability-card ${vulns[0].gravidade === 'media' ? 'medium' : vulns[0].gravidade === 'baixa' ? 'low' : ''}">
          <div class="vulnerability-header">
            <div class="vulnerability-title">
              ⚠️ ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}
              <span class="tag tag-red">${vulns.length} ocorrências</span>
            </div>
            <span class="vulnerability-severity ${vulns[0].gravidade}">${vulns[0].gravidade}</span>
          </div>
          <div class="vulnerability-description">
            ${vulns[0].descricao}
          </div>
          <div class="vulnerability-affected" style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: var(--space-md)">
            Afeta: ${vulns.map(v => v.concorrente).join(', ')}
          </div>
          <div class="vulnerability-action">
            <div class="vulnerability-action-label">💡 Contra-ataque recomendado:</div>
            ${vulns[0].contra_ataque}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// Renderizar Insights
function renderizarInsights() {
  const container = document.getElementById('insights-content');
  if (!container) return;
  
  // Insights baseados nos dados
  const insights = gerarInsights();
  
  if (insights.length === 0) {
    container.innerHTML = renderizarEmptyState('Insights serão gerados após análise completa');
    return;
  }
  
  container.innerHTML = `
    <div class="insight-list">
      ${insights.map((insight, i) => `
        <div class="insight-card ${insight.tipo} fade-in" style="animation-delay: ${i * 0.1}s">
          <div class="insight-header">
            <span class="insight-type ${insight.tipo}">${insight.tipo}</span>
            <span class="insight-title">${insight.titulo}</span>
          </div>
          <div class="insight-description">${insight.descricao}</div>
          ${insight.fonte ? `<div class="insight-source">Fonte: ${insight.fonte}</div>` : ''}
        </div>
      `).join('')}
    </div>
  `;
}

// Gerar insights automáticos
function gerarInsights() {
  const insights = [];
  
  // Insight sobre credenciamento
  const comMEC = AppState.concorrentes.filter(c => 
    c.ficha_cadastral?.credenciamento_mec?.includes('Credenciada')
  ).length;
  
  if (comMEC < AppState.concorrentes.length / 2) {
    insights.push({
      tipo: 'strategic',
      titulo: 'Oportunidade: Destacar credenciamento MEC',
      descricao: `Apenas ${comMEC} de ${AppState.concorrentes.length} concorrentes possuem credenciamento MEC claramente demonstrado. Isso representa uma oportunidade de diferenciação significativa.`,
      fonte: 'Análise de fichas cadastrais'
    });
  }
  
  // Insight sobre transparência
  const comDocentePublico = AppState.concorrentes.filter(c => 
    c.autoridade?.corpo_docente_publico
  ).length;
  
  if (comDocentePublico < AppState.concorrentes.length / 2) {
    insights.push({
      tipo: 'tactical',
      titulo: 'Vulnerabilidade comum: Falta de transparência docente',
      descricao: `${AppState.concorrentes.length - comDocentePublico} concorrentes não apresentam corpo docente publicamente.`,
      fonte: 'Análise de autoridade institucional'
    });
  }
  
  // Insight sobre preços
  const comPreco = AppState.concorrentes.filter(c => c.oferta?.valor_total).length;
  if (comPreco < AppState.concorrentes.length * 0.7) {
    insights.push({
      tipo: 'strategic',
      titulo: 'Oportunidade: Transparência de preço como diferencial',
      descricao: `Apenas ${comPreco} concorrentes demonstram preços transparentemente. A falta de clareza pode ser explorada com comunicação direta.`,
      fonte: 'Análise de ofertas'
    });
  }
  
  return insights;
}

// Renderizar empty state
function renderizarEmptyState(mensagem) {
  return `
    <div class="empty-state">
      <div class="empty-state-icon">📋</div>
      <div class="empty-state-title">${mensagem}</div>
    </div>
  `;
}

// Setup Event Listeners
function setupEventListeners() {
  // Search input
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      AppState.filtros.busca = e.target.value;
      renderizarConcorrentes();
    });
  }
  
  // Filters
  const filterGrupo = document.getElementById('filter-grupo');
  const filterPrioridade = document.getElementById('filter-prioridade');
  const filterAds = document.getElementById('filter-ads');
  
  if (filterGrupo) {
    filterGrupo.addEventListener('change', (e) => {
      AppState.filtros.grupo = e.target.value;
      renderizarConcorrentes();
    });
  }
  
  if (filterPrioridade) {
    filterPrioridade.addEventListener('change', (e) => {
      AppState.filtros.prioridade = e.target.value;
      renderizarConcorrentes();
    });
  }
  
  if (filterAds) {
    filterAds.addEventListener('change', (e) => {
      AppState.filtros.temAds = e.target.value;
      renderizarConcorrentes();
    });
  }
  
  // Smooth scroll for nav
  document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        document.querySelectorAll('.nav a').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });
  
  // Scroll spy
  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.pageYOffset >= sectionTop - 100) {
        current = section.getAttribute('id');
      }
    });
    
    document.querySelectorAll('.nav a').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });
}

// Toggle expand card
function toggleExpand(id) {
  const card = document.querySelector(`[data-id="${id}"]`);
  const detail = document.getElementById(`detail-${id}`);
  
  if (card && detail) {
    card.classList.toggle('expanded');
    detail.style.display = card.classList.contains('expanded') ? 'block' : 'none';
  }
}

// Switch tab
function switchTab(concorrenteId, tabName) {
  // Update tabs
  const tabs = document.querySelectorAll(`#detail-${concorrenteId} .competitor-tab`);
  tabs.forEach(tab => tab.classList.remove('active'));
  event.target.classList.add('active');
  
  // Update content
  const contents = document.querySelectorAll(`#detail-${concorrenteId} .competitor-tab-content`);
  contents.forEach(content => content.classList.remove('active'));
  document.getElementById(`tab-${concorrenteId}-${tabName}`).classList.add('active');
}

// Toggle comparação
function toggleComparacao(id) {
  const index = AppState.comparacao.indexOf(id);
  
  if (index > -1) {
    AppState.comparacao.splice(index, 1);
  } else {
    if (AppState.comparacao.length >= 3) {
      mostrarToast('Máximo de 3 concorrentes para comparar', 'error');
      return;
    }
    AppState.comparacao.push(id);
  }
  
  renderizarConcorrentes();
  atualizarBarraComparacao();
}

// Atualizar barra de comparação
function atualizarBarraComparacao() {
  const bar = document.getElementById('comparison-bar');
  if (!bar) return;
  
  if (AppState.comparacao.length === 0) {
    bar.classList.remove('active');
    return;
  }
  
  bar.classList.add('active');
  
  const selected = document.getElementById('comparison-selected');
  const concorrentesSelecionados = AppState.concorrentes.filter(c => 
    AppState.comparacao.includes(c.id)
  );
  
  selected.innerHTML = concorrentesSelecionados.map(c => `
    <div class="comparison-selected-item">
      ${c.nome}
      <button onclick="toggleComparacao('${c.id}')">×</button>
    </div>
  `).join('');
}

// Mostrar modal de comparação
function showComparison() {
  const modal = document.getElementById('comparison-modal');
  const tbody = document.getElementById('comparison-tbody');
  
  if (!modal || !tbody) return;
  
  const concorrentesSelecionados = AppState.concorrentes.filter(c => 
    AppState.comparacao.includes(c.id)
  );
  
  const atributos = [
    { label: 'Nome', key: 'nome' },
    { label: 'Grupo', key: 'grupo' },
    { label: 'Prioridade', key: 'prioridade' },
    { label: 'Credenciamento MEC', key: 'ficha_cadastral.credenciamento_mec' },
    { label: 'Preço Total', key: 'oferta.valor_total', format: v => v ? `R$ ${v.toLocaleString()}` : 'N/A' },
    { label: 'Docente Público', key: 'autoridade.corpo_docente_publico', format: v => v ? 'Sim' : 'Não' },
    { label: 'Anúncios Ativos', key: 'trafego_pago.meta_ads.anuncios_ativos' },
    { label: 'Instagram', key: 'digital.instagram.seguidores' },
    { label: 'Headline', key: 'posicionamento.headline' }
  ];
  
  tbody.innerHTML = atributos.map(attr => `
    <tr>
      <td><strong>${attr.label}</strong></td>
      ${concorrentesSelecionados.map(c => {
        let value = attr.key.split('.').reduce((o, k) => o?.[k], c);
        if (attr.format) value = attr.format(value);
        return `<td>${value || 'N/A'}</td>`;
      }).join('')}
    </tr>
  `).join('');
  
  modal.classList.add('active');
}

// Fechar modal
function closeComparison() {
  const modal = document.getElementById('comparison-modal');
  if (modal) modal.classList.remove('active');
}

// Mostrar toast
function mostrarToast(mensagem, tipo = 'success') {
  const container = document.getElementById('toast-container') || criarToastContainer();
  
  const toast = document.createElement('div');
  toast.className = `toast ${tipo}`;
  toast.innerHTML = `
    <span>${tipo === 'success' ? '✓' : '✗'}</span>
    <span>${mensagem}</span>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function criarToastContainer() {
  const container = document.createElement('div');
  container.id = 'toast-container';
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}

// Mostrar erro
function mostrarErro(mensagem) {
  console.error(mensagem);
  mostrarToast(mensagem, 'error');
}

// Adicionar event listeners aos cards
function adicionarEventListenersCards() {
  // Event listeners são adicionados via onclick nos elementos
}

// Atualizar data
function atualizarData() {
  const dateEl = document.getElementById('date');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}

// Inicializar gráficos
function inicializarGraficos() {
  // Será implementado quando Chart.js for adicionado
}

// Start app when DOM is ready
document.addEventListener('DOMContentLoaded', init);

// Exportar funções globais
window.toggleExpand = toggleExpand;
window.switchTab = switchTab;
window.toggleComparacao = toggleComparacao;
window.showComparison = showComparison;
window.closeComparison = closeComparison;
