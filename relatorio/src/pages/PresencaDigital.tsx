import { useState, useMemo } from 'react';
import {
  Instagram,
  Youtube,
  Linkedin,
  Twitter,
  Facebook,
  Music2,
  Globe,
  Users,
  TrendingUp,
  Award,
  Filter,
  Crown,
  Share2,
  UserCircle,
  Building2,
  Target,
  BarChart3
} from 'lucide-react';

// ==========================================
// TIPOS
// ==========================================

interface RedeSocial {
  nome: string;
  perfil: string;
  url?: string;
  seguidores?: string;
  posts?: string;
  descricao?: string;
}

interface ConcorrenteDigital {
  id: string;
  nome: string;
  tipo: 'Nicho' | 'Institucional';
  site: string;
  instagram?: RedeSocial | RedeSocial[];
  youtube?: RedeSocial;
  linkedin?: RedeSocial;
  twitter?: RedeSocial;
  facebook?: RedeSocial;
  tiktok?: RedeSocial;
  spotify?: RedeSocial;
  outras?: Record<string, string>;
  nota?: string;
  estrategia_destaque?: string;
  seguidores_total?: number;
}

interface EstrategiaDestaque {
  titulo: string;
  descricao: string;
  concorrentes: string[];
  icone: React.ReactNode;
  cor: string;
}

// ==========================================
// DADOS
// ==========================================

const concorrentesData: ConcorrenteDigital[] = [
  {
    id: 'liberdade_medica',
    nome: 'Liberdade Médica',
    tipo: 'Nicho',
    site: 'https://liberdademedicaedu.com.br',
    instagram: {
      nome: 'Instagram',
      perfil: '@liberdademedicaedu',
      url: 'https://www.instagram.com/liberdademedicaedu/',
      seguidores: '473K',
      posts: '2.228',
      descricao: '🎯 1 MILHÃO de Vidas Salvas nos próximos 10 anos'
    },
    youtube: {
      nome: 'YouTube',
      perfil: '@liberdademedicatv',
      url: 'https://www.youtube.com/@liberdademedicatv'
    },
    nota: '⭐⭐⭐⭐⭐',
    estrategia_destaque: 'Prova Social Massiva',
    seguidores_total: 473000
  },
  {
    id: 'ipm',
    nome: 'IPM (Pedro Miranda)',
    tipo: 'Nicho',
    site: 'https://ipmpos.com.br',
    instagram: [
      {
        nome: 'Instagram Institucional',
        perfil: '@ipm.pos',
        url: 'https://www.instagram.com/ipm.pos/'
      },
      {
        nome: 'Instagram Fundador',
        perfil: '@pedroernestomiranda',
        url: 'https://www.instagram.com/pedroernestomiranda/',
        seguidores: '118K',
        posts: '994'
      }
    ],
    linkedin: {
      nome: 'LinkedIn',
      perfil: 'IPM EDUCAÇÃO',
      url: 'https://br.linkedin.com/company/ipmpos'
    },
    nota: '⭐⭐⭐⭐',
    estrategia_destaque: 'Fundador como Influencer',
    seguidores_total: 118000
  },
  {
    id: 'sanar',
    nome: 'Sanar',
    tipo: 'Institucional',
    site: 'https://sanar.com.br',
    instagram: [
      {
        nome: 'Sanar',
        perfil: '@sanar',
        url: 'https://www.instagram.com/sanar/'
      },
      {
        nome: 'SanarFlix',
        perfil: '@sanarflix',
        url: 'https://www.instagram.com/sanarflix/'
      },
      {
        nome: 'Sanar Pós',
        perfil: '@sanarpos.med',
        url: 'https://www.instagram.com/sanarpos.med/'
      },
      {
        nome: 'Sanar Shopping',
        perfil: '@sanar.shopping',
        url: 'https://www.instagram.com/sanar.shopping/'
      }
    ],
    youtube: {
      nome: 'YouTube',
      perfil: 'Sanar Oficial',
      url: 'https://www.youtube.com/c/SanarOficial'
    },
    linkedin: {
      nome: 'LinkedIn',
      perfil: 'Sanar',
      url: 'https://www.linkedin.com/company/sanar/'
    },
    twitter: {
      nome: 'Twitter',
      perfil: '@sanartech'
    },
    facebook: {
      nome: 'Facebook',
      perfil: 'TalentosSanar'
    },
    nota: '⭐⭐⭐⭐⭐',
    estrategia_destaque: 'Multi-perfil',
    seguidores_total: 0
  },
  {
    id: 'pucrs',
    nome: 'PUCRS',
    tipo: 'Institucional',
    site: 'https://pucrs.br',
    instagram: {
      nome: 'Instagram',
      perfil: '@pucrs',
      url: 'https://www.instagram.com/pucrs/'
    },
    youtube: {
      nome: 'YouTube',
      perfil: '@PUCRSOficial',
      url: 'https://www.youtube.com/@PUCRSOficial'
    },
    linkedin: {
      nome: 'LinkedIn',
      perfil: 'PUCRS',
      url: 'https://www.linkedin.com/school/pucrs/'
    },
    twitter: {
      nome: 'Twitter',
      perfil: '@pucrs'
    },
    tiktok: {
      nome: 'TikTok',
      perfil: '@pucrs'
    },
    facebook: {
      nome: 'Facebook',
      perfil: 'pucrs'
    },
    nota: '⭐⭐⭐⭐⭐',
    estrategia_destaque: 'Maior Diversidade de Redes',
    seguidores_total: 0
  },
  {
    id: 'einstein',
    nome: 'Einstein',
    tipo: 'Institucional',
    site: 'https://einstein.br',
    instagram: {
      nome: 'Instagram',
      perfil: '@hosp_einstein',
      url: 'https://instagram.com/hosp_einstein'
    },
    youtube: {
      nome: 'YouTube',
      perfil: '@einstein',
      url: 'https://www.youtube.com/@einstein'
    },
    linkedin: {
      nome: 'LinkedIn',
      perfil: 'Einstein Hospital Israelita',
      url: 'https://www.linkedin.com/company/einstein-hospital-israelita'
    },
    facebook: {
      nome: 'Facebook',
      perfil: 'EinsteinHospital'
    },
    tiktok: {
      nome: 'TikTok',
      perfil: '@hosp_einstein'
    },
    spotify: {
      nome: 'Spotify',
      perfil: 'Hospital Albert Einstein',
      url: 'https://open.spotify.com/user/hospital_albert_einstein'
    },
    nota: '⭐⭐⭐⭐⭐',
    estrategia_destaque: 'Presença em Podcasts',
    seguidores_total: 0
  },
  {
    id: 'unyleya',
    nome: 'Unyleya',
    tipo: 'Institucional',
    site: 'https://unyleya.edu.br',
    instagram: {
      nome: 'Instagram',
      perfil: '@faculdadeunyleya',
      url: 'https://www.instagram.com/faculdadeunyleya/'
    },
    youtube: {
      nome: 'YouTube',
      perfil: '@faculdade.unyleya',
      url: 'https://www.youtube.com/@faculdade.unyleya'
    },
    linkedin: {
      nome: 'LinkedIn',
      perfil: 'Unyleya Educacional',
      url: 'https://www.linkedin.com/company/unyleyaeducacional/'
    },
    twitter: {
      nome: 'Twitter',
      perfil: '@Unyleya'
    },
    tiktok: {
      nome: 'TikTok',
      perfil: '@unyleya'
    },
    facebook: {
      nome: 'Facebook',
      perfil: 'faculdadeunyleya'
    },
    nota: '⭐⭐⭐',
    estrategia_destaque: 'Apps Próprios',
    seguidores_total: 0
  },
  {
    id: 'mevbrasil',
    nome: 'MEV Brasil',
    tipo: 'Institucional',
    site: 'https://mevbrasil.com.br',
    instagram: {
      nome: 'Instagram',
      perfil: '@mevbrasil',
      url: 'https://www.instagram.com/mevbrasil/'
    },
    linkedin: {
      nome: 'LinkedIn',
      perfil: 'MEV Brasil',
      url: 'https://www.linkedin.com/company/mevbrasil'
    },
    spotify: {
      nome: 'Spotify',
      perfil: 'Podcast MEV'
    },
    nota: '⭐⭐⭐⭐',
    estrategia_destaque: 'Comunidade/Tribo',
    seguidores_total: 1100
  },
  {
    id: 'fgmed',
    nome: 'FGMED',
    tipo: 'Institucional',
    site: 'https://fgmed.org',
    instagram: {
      nome: 'Instagram',
      perfil: '@fgmed.online',
      url: 'https://www.instagram.com/fgmed.online/'
    },
    youtube: {
      nome: 'YouTube',
      perfil: '@fgmed9133',
      url: 'https://www.youtube.com/@fgmed9133'
    },
    linkedin: {
      nome: 'LinkedIn',
      perfil: 'FGMED',
      url: 'https://www.linkedin.com/company/fgmed/'
    },
    twitter: {
      nome: 'Twitter',
      perfil: '@fgmedbr'
    },
    facebook: {
      nome: 'Facebook',
      perfil: 'FG.FGMED'
    },
    nota: '⭐⭐⭐',
    seguidores_total: 0
  },
  {
    id: 'cdt',
    nome: 'Instituto CDT',
    tipo: 'Institucional',
    site: 'https://institutocdt.com.br',
    instagram: {
      nome: 'Instagram',
      perfil: '@institutocdt',
      url: 'https://www.instagram.com/institutocdt/'
    },
    youtube: {
      nome: 'YouTube',
      perfil: 'Instituto CDT',
      url: 'https://www.youtube.com/channel/UCmljj6vCQ2ZGv4832SRoq0g'
    },
    linkedin: {
      nome: 'LinkedIn',
      perfil: 'Instituto CDT',
      url: 'https://www.linkedin.com/company/81813900/'
    },
    tiktok: {
      nome: 'TikTok',
      perfil: '@drthiago'
    },
    nota: '⭐⭐⭐⭐',
    estrategia_destaque: 'Educação Prática',
    seguidores_total: 0
  },
  {
    id: 'ibcmed',
    nome: 'IBCMED / Inspirali',
    tipo: 'Institucional',
    site: 'https://ibcmed.com',
    instagram: {
      nome: 'Instagram',
      perfil: '@inspirali.posmedicina',
      url: 'https://www.instagram.com/inspirali.posmedicina/'
    },
    youtube: {
      nome: 'YouTube',
      perfil: '@inspirali.posmedicina',
      url: 'https://www.youtube.com/@inspirali.posmedicina'
    },
    linkedin: {
      nome: 'LinkedIn',
      perfil: 'Inspirali Pós',
      url: 'https://www.linkedin.com/company/inspiralipos/'
    },
    facebook: {
      nome: 'Facebook',
      perfil: 'inspirali.pos'
    },
    tiktok: {
      nome: 'TikTok',
      perfil: '@inspirali.pos'
    },
    nota: '⭐⭐⭐',
    seguidores_total: 0
  },
  {
    id: 'cetrus',
    nome: 'Cetrus',
    tipo: 'Institucional',
    site: 'https://cetrus.com.br',
    instagram: {
      nome: 'Instagram',
      perfil: '@cetrus.ensino',
      url: 'https://www.instagram.com/cetrus.ensino/'
    },
    youtube: {
      nome: 'YouTube',
      perfil: 'Cetrus',
      url: 'https://www.youtube.com/user/mktcetrus'
    },
    linkedin: {
      nome: 'LinkedIn',
      perfil: 'Cetrus Ensino',
      url: 'https://br.linkedin.com/company/cetrusensino'
    },
    facebook: {
      nome: 'Facebook',
      perfil: 'CetrusBrasil'
    },
    nota: '⭐⭐⭐',
    estrategia_destaque: 'Educação Prática',
    seguidores_total: 0
  },
  {
    id: 'afya',
    nome: 'Afya',
    tipo: 'Institucional',
    site: 'https://afya.com.br',
    instagram: {
      nome: 'Instagram',
      perfil: '@afya.oficial',
      url: 'https://www.instagram.com/afya.oficial/'
    },
    youtube: {
      nome: 'YouTube',
      perfil: 'Afya Educacional',
      url: 'https://www.youtube.com/c/Afyaeducacional'
    },
    linkedin: {
      nome: 'LinkedIn',
      perfil: 'Afya Medicina',
      url: 'https://br.linkedin.com/company/afyamedicina'
    },
    facebook: {
      nome: 'Facebook',
      perfil: 'afyaeducacional'
    },
    nota: '⭐⭐⭐',
    seguidores_total: 0
  },
  {
    id: 'slmandic',
    nome: 'São Leopoldo Mandic',
    tipo: 'Institucional',
    site: 'https://slmandic.edu.br',
    instagram: {
      nome: 'Instagram',
      perfil: '@saoleopoldomandic',
      url: 'https://www.instagram.com/saoleopoldomandic/'
    },
    youtube: {
      nome: 'YouTube',
      perfil: 'São Leopoldo Mandic',
      url: 'https://www.youtube.com/channel/UClx774EbaBecptaAvw00n0A'
    },
    linkedin: {
      nome: 'LinkedIn',
      perfil: 'São Leopoldo Mandic',
      url: 'https://br.linkedin.com/school/saoleopoldomandic/'
    },
    facebook: {
      nome: 'Facebook',
      perfil: 'saoleopoldomandic'
    },
    outras: {
      podcast: 'Mandicast'
    },
    nota: '⭐⭐⭐',
    seguidores_total: 0
  },
  {
    id: 'hcor',
    nome: 'HCOR',
    tipo: 'Institucional',
    site: 'https://hcor.com.br',
    instagram: {
      nome: 'Instagram',
      perfil: '@hcoroficial',
      url: 'https://www.instagram.com/hcoroficial/'
    },
    youtube: {
      nome: 'YouTube',
      perfil: 'HCOR',
      url: 'https://www.youtube.com/channel/UC7tOeqLpmCejyymIyZlrWNQ'
    },
    linkedin: {
      nome: 'LinkedIn',
      perfil: 'HCOR',
      url: 'https://www.linkedin.com/company/hcor'
    },
    facebook: {
      nome: 'Facebook',
      perfil: 'HCor.Oficial'
    },
    nota: '⭐⭐⭐',
    seguidores_total: 0
  },
  {
    id: 'caduceu',
    nome: 'Caduceu',
    tipo: 'Nicho',
    site: 'https://caduceucursos.com.br',
    instagram: {
      nome: 'Instagram',
      perfil: '@caduceucursos'
    },
    facebook: {
      nome: 'Facebook',
      perfil: 'Caduceu Cursos'
    },
    nota: '⭐⭐⭐',
    estrategia_destaque: 'Personal Brand',
    seguidores_total: 0
  },
  {
    id: 'comportamente',
    nome: 'Comportalmente',
    tipo: 'Nicho',
    site: 'https://comportalmente.com.br',
    instagram: {
      nome: 'Instagram',
      perfil: '@comportalmente'
    },
    facebook: {
      nome: 'Facebook',
      perfil: 'Comportalmente'
    },
    linkedin: {
      nome: 'LinkedIn',
      perfil: 'Comportalmente'
    },
    nota: '⭐⭐⭐',
    estrategia_destaque: 'Nicho Especializado',
    seguidores_total: 0
  },
  {
    id: 'bws',
    nome: 'Instituto BWS',
    tipo: 'Nicho',
    site: 'https://institutobws.com.br',
    instagram: {
      nome: 'Instagram',
      perfil: '@institutobws'
    },
    linkedin: {
      nome: 'LinkedIn',
      perfil: 'Instituto BWS'
    },
    nota: '⭐⭐⭐',
    seguidores_total: 0
  },
  {
    id: 'idomed',
    nome: 'IDOMED',
    tipo: 'Institucional',
    site: 'https://idomed.com.br',
    outras: {
      whatsapp: '0800 880 6770'
    },
    nota: '⭐⭐⭐',
    seguidores_total: 0
  },
  {
    id: 'sirio_libanes',
    nome: 'Faculdade Sírio-Libanês',
    tipo: 'Institucional',
    site: 'https://faculdadesiriolibanes.org.br',
    nota: '⭐⭐⭐',
    seguidores_total: 0
  }
];

const estrategiasDestaque: EstrategiaDestaque[] = [
  {
    titulo: 'Multi-perfil',
    descricao: 'Estratégia de criar múltiplos perfis segmentados para diferentes públicos e produtos',
    concorrentes: ['Sanar'],
    icone: <Share2 className="w-6 h-6" />,
    cor: 'bg-purple-500'
  },
  {
    titulo: 'Fundador como Influencer',
    descricao: 'Usar o perfil pessoal do fundador como vetor de autoridade e alcance orgânico',
    concorrentes: ['IPM (Pedro Miranda)'],
    icone: <UserCircle className="w-6 h-6" />,
    cor: 'bg-orange-500'
  },
  {
    titulo: 'Prova Social Massiva',
    descricao: 'Maior audiência entre todos os concorrentes de nicho com engajamento consistente',
    concorrentes: ['Liberdade Médica'],
    icone: <Users className="w-6 h-6" />,
    cor: 'bg-green-500'
  },
  {
    titulo: 'Comunidade/Tribo',
    descricao: 'Construção de comunidade ativa antes mesmo da venda do produto',
    concorrentes: ['MEV Brasil'],
    icone: <Target className="w-6 h-6" />,
    cor: 'bg-blue-500'
  },
  {
    titulo: 'Maior Diversidade de Redes',
    descricao: 'Presença em todas as principais plataformas sociais disponíveis',
    concorrentes: ['PUCRS'],
    icone: <Globe className="w-6 h-6" />,
    cor: 'bg-indigo-500'
  },
  {
    titulo: 'Presença em Podcasts',
    descricao: 'Estratégia de conteúdo em áudio via Spotify e outras plataformas',
    concorrentes: ['Einstein', 'MEV Brasil', 'São Leopoldo Mandic'],
    icone: <Music2 className="w-6 h-6" />,
    cor: 'bg-pink-500'
  }
];

// ==========================================
// COMPONENTES AUXILIARES
// ==========================================

const parseSeguidores = (seguidores: string | undefined): number => {
  if (!seguidores) return 0;
  const clean = seguidores.replace(/[^0-9.KM]/gi, '');
  if (clean.includes('K')) {
    return parseFloat(clean.replace('K', '')) * 1000;
  }
  if (clean.includes('M')) {
    return parseFloat(clean.replace('M', '')) * 1000000;
  }
  return parseInt(clean) || 0;
};

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

export default function PresencaDigital() {
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'Nicho' | 'Institucional'>('todos');
  const [filtroPlataforma, setFiltroPlataforma] = useState<string>('todas');

  // Filtrar concorrentes
  const concorrentesFiltrados = useMemo(() => {
    return concorrentesData.filter(player => {
      if (filtroTipo !== 'todos' && player.tipo !== filtroTipo) return false;
      if (filtroPlataforma !== 'todas') {
        const hasPlataforma = 
          (filtroPlataforma === 'instagram' && player.instagram) ||
          (filtroPlataforma === 'youtube' && player.youtube) ||
          (filtroPlataforma === 'linkedin' && player.linkedin) ||
          (filtroPlataforma === 'twitter' && player.twitter) ||
          (filtroPlataforma === 'facebook' && player.facebook) ||
          (filtroPlataforma === 'tiktok' && player.tiktok) ||
          (filtroPlataforma === 'spotify' && player.spotify);
        if (!hasPlataforma) return false;
      }
      return true;
    });
  }, [filtroTipo, filtroPlataforma]);

  // Principais concorrentes por seguidores
  const principaisConcorrentes = useMemo(() => {
    return [...concorrentesData]
      .filter(p => p.seguidores_total && p.seguidores_total > 0)
      .sort((a, b) => (b.seguidores_total || 0) - (a.seguidores_total || 0))
      .slice(0, 5);
  }, []);

  // Dados para gráfico de barras
  const dadosGrafico = useMemo(() => {
    return concorrentesData
      .filter(p => {
        const insta = p.instagram;
        if (Array.isArray(insta)) {
          return insta.some(i => i.seguidores);
        }
        return insta?.seguidores;
      })
      .map(p => {
        const insta = p.instagram;
        let seguidores = 0;
        if (Array.isArray(insta)) {
          const main = insta.find(i => i.seguidores);
          seguidores = parseSeguidores(main?.seguidores);
        } else {
          seguidores = parseSeguidores(insta?.seguidores);
        }
        return { nome: p.nome, seguidores, tipo: p.tipo };
      })
      .sort((a, b) => b.seguidores - a.seguidores)
      .slice(0, 8);
  }, []);

  const maxSeguidores = Math.max(...dadosGrafico.map(d => d.seguidores));

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/10 rounded-lg">
              <Globe className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-[var(--color-primary-light)] uppercase tracking-wider">
              Análise de Concorrência
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Presença Digital
          </h1>
          <p className="text-[var(--color-primary-light)] max-w-3xl text-lg">
            Análise completa do posicionamento digital de 20 concorrentes do mercado de educação médica. 
            Mapeamento de redes sociais, estratégias de conteúdo e oportunidades de diferenciação.
          </p>
          
          {/* Stats rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold">20</div>
              <div className="text-sm text-[var(--color-primary-light)]">Concorrentes Mapeados</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold">473K</div>
              <div className="text-sm text-[var(--color-primary-light)]">Maior Audiência</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold">6</div>
              <div className="text-sm text-[var(--color-primary-light)]">Plataformas (PUCRS)</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold">4</div>
              <div className="text-sm text-[var(--color-primary-light)]">Perfis Sanar</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm border border-[var(--color-bg-secondary)] p-4 mb-8">
          <div className="flex items-center gap-2 mb-4 text-[var(--color-text-secondary)]">
            <Filter className="w-5 h-5" />
            <span className="font-semibold">Filtros</span>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="filtro-tipo" className="text-sm text-[var(--color-text-secondary)] font-medium">Tipo:</label>
              <select
                id="filtro-tipo"
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value as any)}
                aria-label="Filtrar por tipo de player"
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent focus:outline-none"
              >
                <option value="todos">Todos</option>
                <option value="Nicho">Nicho</option>
                <option value="Institucional">Institucional</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="filtro-plataforma" className="text-sm text-[var(--color-text-secondary)] font-medium">Plataforma:</label>
              <select
                id="filtro-plataforma"
                value={filtroPlataforma}
                onChange={(e) => setFiltroPlataforma(e.target.value)}
                aria-label="Filtrar por plataforma social"
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent focus:outline-none"
              >
                <option value="todas">Todas</option>
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube</option>
                <option value="linkedin">LinkedIn</option>
                <option value="twitter">Twitter</option>
                <option value="facebook">Facebook</option>
                <option value="tiktok">TikTok</option>
                <option value="spotify">Spotify</option>
              </select>
            </div>
          </div>
        </div>

        {/* Principais Concorrentes Cards */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <Crown className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">5 Principais Concorrentes por Seguidores</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {principaisConcorrentes.map((player, index) => (
              <div
                key={player.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-[var(--color-bg-secondary)] overflow-hidden focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
              >
                <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] px-4 py-3 flex items-center justify-between">
                  <span className="text-white font-bold">#{index + 1}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    player.tipo === 'Nicho' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {player.tipo}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-[var(--color-text-primary)] mb-1">{player.nome}</h3>
                  <div className="flex items-center gap-2 text-2xl font-bold text-[var(--color-primary)] mb-3">
                    <Instagram className="w-6 h-6" />
                    {player.seguidores_total && player.seguidores_total >= 1000 
                      ? `${(player.seguidores_total / 1000).toFixed(0)}K`
                      : player.seguidores_total}
                  </div>
                  {player.estrategia_destaque && (
                    <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span>{player.estrategia_destaque}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {/* Card CENBRAP Oportunidade */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-md border-2 border-orange-300 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3">
                <span className="text-white font-bold">OPORTUNIDADE</span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-[var(--color-text-primary)] mb-1">CENBRAP</h3>
                <div className="flex items-center gap-2 text-2xl font-bold text-orange-600 mb-3">
                  <TrendingUp className="w-6 h-6" />
                  Potencial de Crescimento
                </div>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Espaço para construir presença digital forte no nicho de pós-graduação médica
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Gráfico de Barras */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-6 h-6 text-[var(--color-primary)]" />
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Comparativo de Seguidores Instagram</h2>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-[var(--color-bg-secondary)] p-6">
            <div className="space-y-4">
              {dadosGrafico.map((item) => (
                <div key={item.nome} className="flex items-center gap-4">
                  <div className="w-32 md:w-48 text-sm font-medium text-[var(--color-text-secondary)] truncate">
                    {item.nome}
                  </div>
                  <div className="flex-1 h-8 bg-[var(--color-bg-secondary)] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full flex items-center justify-end pr-3 transition-all duration-500 ${
                        item.tipo === 'Nicho' 
                          ? 'bg-gradient-to-r from-orange-400 to-orange-500' 
                          : 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)]'
                      }`}
                      style={{ width: `${(item.seguidores / maxSeguidores) * 100}%` }}
                    >
                      {item.seguidores > 50000 && (
                        <span className="text-white text-xs font-medium">
                          {item.seguidores >= 1000000 
                            ? `${(item.seguidores / 1000000).toFixed(1)}M`
                            : `${(item.seguidores / 1000).toFixed(0)}K`}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-16 text-right text-sm text-[var(--color-text-secondary)]">
                    {item.seguidores >= 1000000 
                      ? `${(item.seguidores / 1000000).toFixed(1)}M`
                      : `${(item.seguidores / 1000).toFixed(0)}K`}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-[var(--color-bg-secondary)]">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-r from-orange-400 to-orange-500"></div>
                <span className="text-sm text-[var(--color-text-secondary)]">Nicho</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)]"></div>
                <span className="text-sm text-[var(--color-text-secondary)]">Institucional</span>
              </div>
            </div>
          </div>
        </section>

        {/* Estratégias de Destaque */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-6 h-6 text-[var(--color-primary)]" />
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Estratégias de Destaque</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {estrategiasDestaque.map((estrategia) => (
              <div
                key={estrategia.titulo}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-[var(--color-bg-secondary)] p-5 focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
              >
                <div className={`w-12 h-12 ${estrategia.cor} rounded-xl flex items-center justify-center text-white mb-4`}>
                  {estrategia.icone}
                </div>
                <h3 className="font-bold text-lg text-[var(--color-text-primary)] mb-2">{estrategia.titulo}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] mb-4">{estrategia.descricao}</p>
                <div className="flex flex-wrap gap-2">
                  {estrategia.concorrentes.map(player => (
                    <span
                      key={player}
                      className="text-xs px-2 py-1 bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] rounded-full"
                    >
                      {player}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tabela de Concorrentes */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-6 h-6 text-[var(--color-primary)]" />
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Mapeamento Completo de Redes Sociais</h2>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-[var(--color-bg-secondary)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-bg-secondary)]">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-secondary)]">Concorrente</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-[var(--color-text-secondary)]">Tipo</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-[var(--color-text-secondary)]">
                      <Instagram className="w-4 h-4 inline" />
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-[var(--color-text-secondary)]">
                      <Youtube className="w-4 h-4 inline" />
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-[var(--color-text-secondary)]">
                      <Linkedin className="w-4 h-4 inline" />
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-[var(--color-text-secondary)]">
                      <Twitter className="w-4 h-4 inline" />
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-[var(--color-text-secondary)]">
                      <Facebook className="w-4 h-4 inline" />
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-[var(--color-text-secondary)]">
                      <Music2 className="w-4 h-4 inline" />
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-[var(--color-text-secondary)]">Outras</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-secondary)]">Estratégia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {concorrentesFiltrados.map((player) => (
                    <tr key={player.id} className="hover:bg-[var(--color-bg-secondary)] transition-colors focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none">
                      <td className="px-4 py-3">
                        <div className="font-medium text-[var(--color-text-primary)]">{player.nome}</div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                          player.tipo === 'Nicho' 
                            ? 'bg-orange-100 text-orange-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {player.tipo === 'Nicho' ? <UserCircle className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
                          {player.tipo}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {player.instagram ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-pink-100 text-pink-600 rounded-full text-xs font-medium">
                            {Array.isArray(player.instagram) ? player.instagram.length : '1'}
                          </span>
                        ) : (
                          <span className="text-[var(--color-text-muted)]">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {player.youtube ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-600 rounded-full">
                            <Youtube className="w-3 h-3" />
                          </span>
                        ) : (
                          <span className="text-[var(--color-text-muted)]">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {player.linkedin ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full">
                            <Linkedin className="w-3 h-3" />
                          </span>
                        ) : (
                          <span className="text-[var(--color-text-muted)]">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {player.twitter ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-sky-100 text-sky-600 rounded-full">
                            <Twitter className="w-3 h-3" />
                          </span>
                        ) : (
                          <span className="text-[var(--color-text-muted)]">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {player.facebook ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full">
                            <Facebook className="w-3 h-3" />
                          </span>
                        ) : (
                          <span className="text-[var(--color-text-muted)]">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {player.spotify ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full">
                            <Music2 className="w-3 h-3" />
                          </span>
                        ) : player.tiktok ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-full">
                            <Music2 className="w-3 h-3" />
                          </span>
                        ) : (
                          <span className="text-[var(--color-text-muted)]">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {player.outras && Object.keys(player.outras).length > 0 ? (
                          <span className="text-xs text-[var(--color-text-secondary)]">
                            {Object.keys(player.outras).join(', ')}
                          </span>
                        ) : (
                          <span className="text-[var(--color-text-muted)]">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {player.estrategia_destaque ? (
                          <span className="text-xs text-[var(--color-text-secondary)] bg-[var(--color-bg-secondary)] px-2 py-1 rounded">
                            {player.estrategia_destaque}
                          </span>
                        ) : (
                          <span className="text-[var(--color-text-muted)] text-xs">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 bg-[var(--color-bg-secondary)] border-t border-[var(--color-bg-secondary)] text-sm text-[var(--color-text-secondary)]">
              Mostrando {concorrentesFiltrados.length} de {concorrentesData.length} concorrentes
            </div>
          </div>
        </section>

        {/* Análises */}
        <section className="mt-10">
          <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Análises e Oportunidades
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2 text-[var(--color-primary-light)]">Oportunidade Identificada</h4>
                <p className="text-sm text-[var(--color-primary-light)] leading-relaxed">
                  Nenhum concorrente combina personalidade (nicho) com escala institucional. 
                  O CENBRAP pode criar uma marca pessoal forte com estrutura institucional, 
                  aproveitando a oportunidade entre Liberdade Médica (473K) e os grandes concorrentes institucionais.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-[var(--color-primary-light)]">Recomendação Estratégica</h4>
                <ul className="text-sm text-[var(--color-primary-light)] space-y-1">
                  <li>• Criar perfil pessoal do fundador (estratégia IPM)</li>
                  <li>• Desenvolver múltiplos perfis segmentados (estratégia Sanar)</li>
                  <li>• Investir em podcasts (pouca concorrência no Spotify)</li>
                  <li>• Construir comunidade antes do lançamento (estratégia MEV)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
