/**
 * Inteligência Competitiva CENBRAP
 * Gráficos e Visualizações
 */

// Configuração global do Chart.js
Chart.defaults.color = '#94a3b8';
Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.06)';
Chart.defaults.font.family = "'Inter', sans-serif";

// Paleta de cores
const colors = {
  blue: '#3b82f6',
  cyan: '#06b6d4',
  emerald: '#10b981',
  amber: '#f59e0b',
  red: '#ef4444',
  purple: '#8b5cf6',
  pink: '#ec4899'
};

const gradients = {};

// Criar gradientes
function createGradients(ctx) {
  const gradientBlue = ctx.createLinearGradient(0, 0, 0, 400);
  gradientBlue.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
  gradientBlue.addColorStop(1, 'rgba(59, 130, 246, 0)');

  const gradientEmerald = ctx.createLinearGradient(0, 0, 0, 400);
  gradientEmerald.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
  gradientEmerald.addColorStop(1, 'rgba(16, 185, 129, 0)');

  const gradientAmber = ctx.createLinearGradient(0, 0, 0, 400);
  gradientAmber.addColorStop(0, 'rgba(245, 158, 11, 0.3)');
  gradientAmber.addColorStop(1, 'rgba(245, 158, 11, 0)');

  gradients.blue = gradientBlue;
  gradients.emerald = gradientEmerald;
  gradients.amber = gradientAmber;
}

// Inicializar todos os gráficos
function initCharts() {
  initPriceDistributionChart();
  initDigitalPresenceChart();
  initVulnerabilityChart();
  initAdsInvestmentChart();
  initPositioningMap();
}

// Gráfico de Distribuição de Preços
function initPriceDistributionChart() {
  const canvas = document.getElementById('priceDistributionChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  createGradients(ctx);

  const precos = AppState.concorrentes
    .filter(c => c.oferta?.valor_total)
    .map(c => c.oferta.valor_total);

  // Criar faixas de preço
  const faixas = {
    'Até R$ 2.000': 0,
    'R$ 2.000-3.500': 0,
    'R$ 3.500-5.000': 0,
    'R$ 5.000-7.000': 0,
    'Acima R$ 7.000': 0
  };

  precos.forEach(preco => {
    if (preco <= 2000) faixas['Até R$ 2.000']++;
    else if (preco <= 3500) faixas['R$ 2.000-3.500']++;
    else if (preco <= 5000) faixas['R$ 3.500-5.000']++;
    else if (preco <= 7000) faixas['R$ 5.000-7.000']++;
    else faixas['Acima R$ 7.000']++;
  });

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(faixas),
      datasets: [{
        label: 'Concorrentes',
        data: Object.values(faixas),
        backgroundColor: [
          colors.emerald,
          colors.blue,
          colors.cyan,
          colors.amber,
          colors.red
        ],
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1a1a26',
          titleColor: '#f8fafc',
          bodyColor: '#94a3b8',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          padding: 12
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { stepSize: 1 }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });
}

// Gráfico de Presença Digital
function initDigitalPresenceChart() {
  const canvas = document.getElementById('digitalPresenceChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  const redes = {
    'Instagram': 0,
    'Facebook': 0,
    'LinkedIn': 0,
    'YouTube': 0,
    'Blog': 0
  };

  AppState.concorrentes.forEach(c => {
    if (c.digital?.instagram?.seguidores) redes['Instagram']++;
    if (c.digital?.facebook?.seguidores) redes['Facebook']++;
    if (c.digital?.linkedin?.seguidores) redes['LinkedIn']++;
    if (c.digital?.youtube?.inscritos) redes['YouTube']++;
    if (c.digital?.blog) redes['Blog']++;
  });

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(redes),
      datasets: [{
        data: Object.values(redes),
        backgroundColor: [
          '#E1306C', // Instagram
          '#1877f2', // Facebook
          '#0a66c2', // LinkedIn
          '#ff0000', // YouTube
          colors.emerald // Blog
        ],
        borderWidth: 0,
        hoverOffset: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: {
          position: 'right',
          labels: {
            padding: 20,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        }
      }
    }
  });
}

// Gráfico de Vulnerabilidades
function initVulnerabilityChart() {
  const canvas = document.getElementById('vulnerabilityChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  const tipos = {};
  AppState.concorrentes.forEach(c => {
    (c.vulnerabilidades || []).forEach(v => {
      tipos[v.tipo] = (tipos[v.tipo] || 0) + 1;
    });
  });

  new Chart(ctx, {
    type: 'polarArea',
    data: {
      labels: Object.keys(tipos).map(t => t.charAt(0).toUpperCase() + t.slice(1)),
      datasets: [{
        data: Object.values(tipos),
        backgroundColor: [
          'rgba(239, 68, 68, 0.5)',
          'rgba(245, 158, 11, 0.5)',
          'rgba(59, 130, 246, 0.5)',
          'rgba(16, 185, 129, 0.5)',
          'rgba(139, 92, 246, 0.5)'
        ],
        borderColor: [
          colors.red,
          colors.amber,
          colors.blue,
          colors.emerald,
          colors.purple
        ],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { display: false, backdropColor: 'transparent' }
        }
      },
      plugins: {
        legend: {
          position: 'right',
          labels: { padding: 15 }
        }
      }
    }
  });
}

// Gráfico de Investimento em Ads
function initAdsInvestmentChart() {
  const canvas = document.getElementById('adsInvestmentChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  const concorrentesComAds = AppState.concorrentes
    .filter(c => c.trafego_pago?.meta_ads?.anuncios_ativos > 0)
    .slice(0, 10);

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: concorrentesComAds.map(c => c.nome.slice(0, 15)),
      datasets: [{
        label: 'Anúncios Ativos',
        data: concorrentesComAds.map(c => c.trafego_pago.meta_ads.anuncios_ativos),
        borderColor: colors.purple,
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: colors.purple,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(255, 255, 255, 0.05)' }
        },
        x: {
          grid: { display: false },
          ticks: { maxRotation: 45 }
        }
      }
    }
  });
}

// Mapa de Posicionamento (Scatter Plot)
function initPositioningMap() {
  const canvas = document.getElementById('positioningMap');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Dados de exemplo - em produção seriam calculados
  const dados = AppState.concorrentes.map((c, i) => ({
    x: c.oferta?.valor_total ? c.oferta.valor_total / 1000 : Math.random() * 10,
    y: c.ficha_cadastral?.credenciamento_mec?.includes('Credenciada') ? 8 + Math.random() * 2 : Math.random() * 8,
    nome: c.nome,
    grupo: c.grupo
  }));

  new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Concorrentes',
        data: dados,
        backgroundColor: dados.map(d =>
          d.grupo === 'diretos' ? colors.amber : colors.blue
        ),
        pointRadius: 8,
        pointHoverRadius: 12
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: {
            generateLabels: () => [
              { text: 'Concorrentes Diretos', fillStyle: colors.amber },
              { text: 'Players Institucionais', fillStyle: colors.blue }
            ]
          }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const d = context.raw;
              return `${d.nome}: R$ ${d.x.toFixed(1)}k | Cred: ${d.y.toFixed(1)}/10`;
            }
          }
        }
      },
      scales: {
        x: {
          title: { display: true, text: 'Preço (R$ mil)' },
          grid: { color: 'rgba(255, 255, 255, 0.05)' }
        },
        y: {
          title: { display: true, text: 'Credibilidade Institucional' },
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          min: 0,
          max: 10
        }
      }
    }
  });
}

// Gráfico de Timeline de Anúncios
function initAdsTimelineChart() {
  const canvas = document.getElementById('adsTimelineChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Dados simulados de timeline
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
  const datasets = AppState.concorrentes
    .filter(c => c.trafego_pago?.meta_ads?.anuncios_ativos > 0)
    .slice(0, 5)
    .map((c, i) => ({
      label: c.nome.slice(0, 10),
      data: meses.map(() => Math.floor(Math.random() * 20)),
      borderColor: Object.values(colors)[i % 6],
      backgroundColor: 'transparent',
      tension: 0.4
    }));

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: meses,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: { padding: 15 }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(255, 255, 255, 0.05)' }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });
}

// Gráfico Radar - Comparação
function initRadarComparison(ids) {
  const canvas = document.getElementById('radarComparisonChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  const concorrentes = AppState.concorrentes.filter(c => ids.includes(c.id));

  const datasets = concorrentes.map((c, i) => ({
    label: c.nome,
    data: [
      c.autoridade?.corpo_docente_publico ? 10 : 5,
      c.oferta?.preco_transparente ? 10 : 5,
      c.ficha_cadastral?.credenciamento_mec?.includes('Credenciada') ? 10 : 3,
      c.digital?.seo_organico === 'Alto' ? 10 : 5,
      c.trafego_pago?.meta_ads?.anuncios_ativos > 0 ? 8 : 3
    ],
    borderColor: Object.values(colors)[i % 6],
    backgroundColor: Object.values(colors)[i % 6] + '20',
    pointBackgroundColor: Object.values(colors)[i % 6]
  }));

  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Autoridade', 'Transparência', 'Credenciamento', 'SEO', 'Investimento Ads'],
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          beginAtZero: true,
          max: 10,
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
          pointLabels: {
            color: '#94a3b8',
            font: { size: 11 }
          }
        }
      },
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

// Exportar funções
window.initCharts = initCharts;
window.initRadarComparison = initRadarComparison;
