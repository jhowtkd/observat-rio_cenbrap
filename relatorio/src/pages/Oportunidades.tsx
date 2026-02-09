import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
    Zap,
    Target,
    TrendingUp,
    CheckCircle2,
    Clock,
    DollarSign,
    Megaphone,
    Award,
    ArrowRight,
    Calendar
} from 'lucide-react';
import type { Competitor } from '../types';

interface Oportunidade {
    id: string;
    titulo: string;
    descricao: string;
    categoria: 'preco' | 'marketing' | 'produto' | 'operacional';
    impacto: 'alto' | 'medio' | 'baixo';
    esforco: 'alto' | 'medio' | 'baixo';
    dificuldade: 'alta' | 'media' | 'baixa';
    tempoImplementacao: string;
    metricas?: {
        label: string;
        valor: string;
        tendencia?: 'up' | 'down' | 'stable';
    }[];
    acoes: string[];
}

export default function Oportunidades() {
    const [competitors, setCompetitors] = useState<Competitor[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');
    const [filtroImpacto, setFiltroImpacto] = useState<string>('todos');

    useEffect(() => {
        fetch('/data/concorrentes.json')
            .then(res => res.json())
            .then(data => {
                const comps = Object.values(data.concorrentes) as Competitor[];
                setCompetitors(comps);
                setLoading(false);
            })
            .catch(err => {
                console.error('Erro ao carregar dados:', err);
                setLoading(false);
            });
    }, []);

    const oportunidades = useMemo((): Oportunidade[] => {
        if (competitors.length === 0) return [];

        const ops: Oportunidade[] = [];

        // Análise de preços
        const precosTransparentes = competitors.filter(c => c.oferta?.preco_transparente).length;
        const precosOcultos = competitors.length - precosTransparentes;
        
        if (precosOcultos > competitors.length * 0.5) {
            ops.push({
                id: 'preco-1',
                titulo: 'Transparência de Preços como Diferencial',
                descricao: `${precosOcultos} concorrentes (${Math.round((precosOcultos/competitors.length)*100)}%) não exibem preços transparentemente. Isso representa uma oportunidade de diferenciação através da clareza na comunicação de valores.`,
                categoria: 'preco',
                impacto: 'alto',
                esforco: 'baixo',
                dificuldade: 'baixa',
                tempoImplementacao: '1-2 semanas',
                metricas: [
                    { label: 'Concorrentes sem transparência', valor: String(precosOcultos), tendencia: 'stable' },
                    { label: 'Potencial de conversão', valor: '+15-25%', tendencia: 'up' }
                ],
                acoes: [
                    'Implementar comparador de preços na landing page',
                    'Criar calculadora de investimento visível',
                    'Destacar valor total do curso de forma clara',
                    'Adicionar selo "Preço Transparente" no site'
                ]
            });
        }

        // Análise de docentes
        const comDocentes = competitors.filter(c => 
            c.autoridade?.professores_destacados && 
            c.autoridade.professores_destacados.length > 0
        ).length;
        const semDocentes = competitors.length - comDocentes;

        if (semDocentes > 5) {
            ops.push({
                id: 'produto-1',
                titulo: 'Destaque do Corpo Docente',
                descricao: `${semDocentes} concorrentes não destacam seus professores. O CENBRAP possui 24 docentes listados, um diferencial significativo que pode ser melhor explorado.`,
                categoria: 'produto',
                impacto: 'alto',
                esforco: 'medio',
                dificuldade: 'media',
                tempoImplementacao: '2-4 semanas',
                metricas: [
                    { label: 'Concorrentes sem docentes visíveis', valor: String(semDocentes), tendencia: 'stable' },
                    { label: 'Docentes CENBRAP', valor: '24', tendencia: 'up' }
                ],
                acoes: [
                    'Criar página dedicada ao corpo docente',
                    'Adicionar vídeos de apresentação dos professores',
                    'Destacar especializações e experiências',
                    'Criar conteúdo com depoimentos dos docentes'
                ]
            });
        }

        // Análise de tráfego pago
        const comAds = competitors.filter(c => 
            (c.trafego_pago?.meta_ads?.anuncios_ativos || 0) > 0
        ).length;
        const semAds = competitors.length - comAds;

        if (semAds > competitors.length * 0.4) {
            ops.push({
                id: 'marketing-1',
                titulo: 'Expansão de Anúncios Online',
                descricao: `${semAds} concorrentes (${Math.round((semAds/competitors.length)*100)}%) não investem em Meta Ads. Há espaço para conquistar participação de mercado através de campanhas estratégicas.`,
                categoria: 'marketing',
                impacto: 'alto',
                esforco: 'alto',
                dificuldade: 'media',
                tempoImplementacao: '4-8 semanas',
                metricas: [
                    { label: 'Concorrentes sem ads', valor: String(semAds), tendencia: 'stable' },
                    { label: 'Potencial de alcance', valor: 'Alto', tendencia: 'up' }
                ],
                acoes: [
                    'Aumentar investimento em Meta Ads',
                    'Testar campanhas no Google Ads',
                    'Criar remarketing para visitantes do site',
                    'Desenvolver criativos comparativos'
                ]
            });
        }

        // Análise de garantia
        const comGarantia = competitors.filter(c => 
            c.oferta?.garantia && 
            !c.oferta.garantia.toLowerCase().includes('não') &&
            !c.oferta.garantia.toLowerCase().includes('nao')
        ).length;

        if (comGarantia < competitors.length * 0.3) {
            ops.push({
                id: 'preco-2',
                titulo: 'Garantia Estendida de Satisfação',
                descricao: 'Poucos concorrentes oferecem garantia robusta. Uma garantia estendida pode reduzir objeções e aumentar a conversão significativamente.',
                categoria: 'preco',
                impacto: 'medio',
                esforco: 'baixo',
                dificuldade: 'baixa',
                tempoImplementacao: '1 semana',
                metricas: [
                    { label: 'Concorrentes com garantia', valor: String(comGarantia), tendencia: 'stable' },
                    { label: 'Redução de objeções', valor: '-30%', tendencia: 'down' }
                ],
                acoes: [
                    'Implementar garantia de 30 dias',
                    'Criar página de política de reembolso clara',
                    'Destacar garantia nos materiais de vendas',
                    'Treinar equipe para comunicar confiança'
                ]
            });
        }

        // Análise de presença digital
        const semInstagram = competitors.filter(c => 
            !c.digital?.redes_sociais?.instagram?.url && !c.digital?.instagram?.url
        ).length;

        if (semInstagram > 3) {
            ops.push({
                id: 'marketing-2',
                titulo: 'Fortalecimento no Instagram',
                descricao: `${semInstagram} concorrentes não têm presença ativa no Instagram. A plataforma é crucial para o público médico e representa oportunidade de engajamento.`,
                categoria: 'marketing',
                impacto: 'medio',
                esforco: 'medio',
                dificuldade: 'baixa',
                tempoImplementacao: '2-4 semanas',
                metricas: [
                    { label: 'Concorrentes sem Instagram', valor: String(semInstagram), tendencia: 'stable' },
                    { label: 'Potencial de engajamento', valor: 'Alto', tendencia: 'up' }
                ],
                acoes: [
                    'Aumentar frequência de posts no Instagram',
                    'Criar conteúdo educativo para médicos',
                    'Utilizar stories para mostrar bastidores',
                    'Implementar campanhas de influencer marketing'
                ]
            });
        }

        // Análise de vulnerabilidades
        const vulnerabilidadesTotais = competitors.reduce((sum, c) => 
            sum + (c.vulnerabilidades?.length || 0), 0
        );

        if (vulnerabilidadesTotais > 10) {
            ops.push({
                id: 'operacional-1',
                titulo: 'Explorar Fraquezas dos Concorrentes',
                descricao: `${vulnerabilidadesTotais} fraquezas identificadas nos concorrentes. Oportunidade de criar campanhas de diferenciação baseadas nas lacunas do mercado.`,
                categoria: 'operacional',
                impacto: 'alto',
                esforco: 'medio',
                dificuldade: 'media',
                tempoImplementacao: '2-6 semanas',
                metricas: [
                    { label: 'Fraquezas mapeadas', valor: String(vulnerabilidadesTotais), tendencia: 'up' },
                    { label: 'Concorrentes com falhas', valor: String(competitors.filter(c => c.vulnerabilidades?.length).length), tendencia: 'stable' }
                ],
                acoes: [
                    'Criar tabela comparativa destacando diferenciais',
                    'Desenvolver campanha "Por que CENBRAP?"',
                    'Criar conteúdo educativo sobre escolha de pós-graduação',
                    'Implementar depoimentos de alunos satisfeitos'
                ]
            });
        }

        return ops;
    }, [competitors]);

    const oportunidadesFiltradas = useMemo(() => {
        return oportunidades.filter(o => {
            const matchesCategoria = filtroCategoria === 'todas' || o.categoria === filtroCategoria;
            const matchesImpacto = filtroImpacto === 'todos' || o.impacto === filtroImpacto;
            return matchesCategoria && matchesImpacto;
        });
    }, [oportunidades, filtroCategoria, filtroImpacto]);

    const getCategoriaIcon = (categoria: string) => {
        switch (categoria) {
            case 'preco': return <DollarSign className="w-4 h-4" />;
            case 'marketing': return <Megaphone className="w-4 h-4" />;
            case 'produto': return <Award className="w-4 h-4" />;
            case 'operacional': return <Target className="w-4 h-4" />;
            default: return <Zap className="w-4 h-4" />;
        }
    };

    const getCategoriaLabel = (categoria: string) => {
        switch (categoria) {
            case 'preco': return 'Preço';
            case 'marketing': return 'Marketing';
            case 'produto': return 'Produto';
            case 'operacional': return 'Operacional';
            default: return categoria;
        }
    };

    const getImpactoColor = (impacto: string) => {
        switch (impacto) {
            case 'alto': return 'text-green-400 bg-green-500/10';
            case 'medio': return 'text-amber-400 bg-amber-500/10';
            case 'baixo': return 'text-[var(--color-text-secondary)] bg-zinc-500/10';
            default: return 'text-[var(--color-text-secondary)] bg-zinc-500/10';
        }
    };

    const getEsforcoColor = (esforco: string) => {
        switch (esforco) {
            case 'baixo': return 'text-green-400';
            case 'medio': return 'text-amber-400';
            case 'alto': return 'text-red-400';
            default: return 'text-[var(--color-text-secondary)]';
        }
    };

    if (loading) {
        return (
            <div 
                className="min-h-screen flex items-center justify-center" 
                style={{ background: '#000' }}
                aria-live="polite"
                aria-busy="true"
            >
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-orange-900 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-[var(--color-text-secondary)]">Carregando oportunidades estratégicas...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ background: '#000' }}>
            {/* Header */}
            <header className="border-b border-white/[0.06] px-8 py-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Oportunidades Estratégicas</h1>
                            <p className="text-sm text-[var(--color-text-secondary)]">Oportunidades identificadas a partir da análise competitiva</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 border border-white/[0.06]">
                            <Calendar className="w-4 h-4 text-[var(--color-text-secondary)]" />
                            <span className="text-sm text-[var(--color-text-secondary)]">
                                {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="p-8">
                {/* KPIs */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 rounded-xl bg-zinc-900/50 border border-white/[0.06]"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <Zap className="w-5 h-5 text-orange-500" />
                            <span className="text-[var(--color-text-secondary)] text-sm">Total de Oportunidades</span>
                        </div>
                        <div className="text-3xl font-bold text-white">{oportunidades.length}</div>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-6 rounded-xl bg-zinc-900/50 border border-white/[0.06]"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingUp className="w-5 h-5 text-green-500" />
                            <span className="text-[var(--color-text-secondary)] text-sm">Alto Impacto</span>
                        </div>
                        <div className="text-3xl font-bold text-white">
                            {oportunidades.filter(o => o.impacto === 'alto').length}
                        </div>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-6 rounded-xl bg-zinc-900/50 border border-white/[0.06]"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <CheckCircle2 className="w-5 h-5 text-blue-500" />
                            <span className="text-[var(--color-text-secondary)] text-sm">Baixo Esforço</span>
                        </div>
                        <div className="text-3xl font-bold text-white">
                            {oportunidades.filter(o => o.esforco === 'baixo').length}
                        </div>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-6 rounded-xl bg-zinc-900/50 border border-white/[0.06]"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <Clock className="w-5 h-5 text-amber-500" />
                            <span className="text-[var(--color-text-secondary)] text-sm">Implementação Rápida</span>
                        </div>
                        <div className="text-3xl font-bold text-white">
                            {oportunidades.filter(o => o.tempoImplementacao.includes('1-2') || o.tempoImplementacao.includes('1 semana')).length}
                        </div>
                    </motion.div>
                </div>

                {/* Filtros */}
                <div className="flex items-center gap-4 mb-6">
                    <select
                        value={filtroCategoria}
                        onChange={(e) => setFiltroCategoria(e.target.value)}
                        aria-label="Filtrar por categoria"
                        className="px-4 py-2 rounded-lg bg-zinc-900 border border-white/[0.06] text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                        <option value="todas">Todas as categorias</option>
                        <option value="preco">Preço</option>
                        <option value="marketing">Marketing</option>
                        <option value="produto">Produto</option>
                        <option value="operacional">Operacional</option>
                    </select>
                    
                    <select
                        value={filtroImpacto}
                        onChange={(e) => setFiltroImpacto(e.target.value)}
                        aria-label="Filtrar por impacto"
                        className="px-4 py-2 rounded-lg bg-zinc-900 border border-white/[0.06] text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                        <option value="todos">Todos os impactos</option>
                        <option value="alto">Alto</option>
                        <option value="medio">Médio</option>
                        <option value="baixo">Baixo</option>
                    </select>
                </div>

                {/* Lista de Oportunidades */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-white mb-4">
                        Oportunidades Identificadas 
                        <span className="ml-2 text-sm font-normal text-[var(--color-text-secondary)]">({oportunidadesFiltradas.length})</span>
                    </h2>
                    
                    {oportunidadesFiltradas.map((op, idx) => (
                        <motion.div
                            key={op.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-6 rounded-xl bg-zinc-900/50 border border-white/[0.06] hover:border-orange-500/30 transition-colors focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255, 122, 0, 0.1)' }}>
                                        {getCategoriaIcon(op.categoria)}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold text-lg">{op.titulo}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="px-2 py-0.5 rounded text-xs bg-zinc-800 text-[var(--color-text-secondary)] capitalize">
                                                {getCategoriaLabel(op.categoria)}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded text-xs capitalize ${getImpactoColor(op.impacto)}`}>
                                                Impacto {op.impacto}
                                            </span>
                                            <span className={`text-xs capitalize ${getEsforcoColor(op.esforco)}`}>
                                                Esforço: {op.esforco}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-[var(--color-text-secondary)]">Tempo</div>
                                    <div className="text-sm text-white font-medium">{op.tempoImplementacao}</div>
                                </div>
                            </div>

                            <p className="text-[var(--color-text-secondary)] text-sm mb-4 leading-relaxed">
                                {op.descricao}
                            </p>

                            {/* Métricas */}
                            {op.metricas && (
                                <div className="flex items-center gap-6 mb-4 p-4 rounded-lg bg-zinc-950/50">
                                    {op.metricas.map((metrica, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <span className="text-xs text-[var(--color-text-secondary)]">{metrica.label}:</span>
                                            <span className="text-sm font-semibold text-white">{metrica.valor}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Ações */}
                            <div className="border-t border-white/[0.06] pt-4">
                                <div className="text-xs text-[var(--color-text-secondary)] mb-2">Ações recomendadas:</div>
                                <div className="grid grid-cols-2 gap-2">
                                    {op.acoes.map((acao, i) => (
                                        <div key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                                            <ArrowRight className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                                            <span>{acao}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
}
