import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Target,
    ShieldAlert,
    TrendingUp,
    Users,
    ChevronDown,
    Zap,
    BarChart3,
    Megaphone,
    AlertTriangle,
    Activity,
    Calendar,
    Instagram,
    Linkedin,
    Facebook,
    Youtube,
    Globe,
    FileText,
    DollarSign
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { RadarComparison } from './charts/RadarComparison';
import { PriceDistribution } from './charts/PriceDistribution';
import { PositioningMatrix } from './charts/PositioningMatrix';
import { AdsInvestmentChart } from './charts/AdsInvestmentChart';
import { ChromeTabs } from './layout/ChromeTabs';
import { PriceRangeBadge } from './shared/PriceTag';
import type { Competitor, AlertItem, OpportunityItem } from '../types';

// Topics for Executive Summary
interface Topic {
    id: string;
    icon: React.ReactNode;
    title: string;
    summary: string;
    details: string[];
}

const topics: Topic[] = [
    {
        id: 'precos',
        icon: <Target className="w-4 h-4" />,
        title: 'Preços',
        summary: 'CENBRAP tem gap de até R$ 9.270',
        details: [
            'Maior preço: R$ 16.470 (FIA)',
            'Menor preço: R$ 3.960 (OGC)',
            'CENBRAP competitivo na média',
            'Gap estratégico explorável'
        ]
    },
    {
        id: 'docentes',
        icon: <Users className="w-4 h-4" />,
        title: 'Corpo Docente',
        summary: 'CENBRAP lidera em transparência',
        details: [
            '24 docentes listados no site',
            'Maioria omite informação',
            'Diferencial competitivo consolidado',
            'Credibilidade validada'
        ]
    },
    {
        id: 'vulnerabilidades',
        icon: <ShieldAlert className="w-4 h-4" />,
        title: 'Vulnerabilidades',
        summary: '17 falhas críticas mapeadas',
        details: [
            'Preço não transparente é #1',
            '12 instituições sem docente',
            '60% sem tráfego pago',
            'Oportunidade de ataque'
        ]
    },
    {
        id: 'posicionamento',
        icon: <TrendingUp className="w-4 h-4" />,
        title: 'Posicionamento',
        summary: 'CENBRAP no quadrante premium',
        details: [
            'Alta presença digital',
            'Preço médio-alto',
            'Concorrentes vulneráveis',
            'Espaço para expansão'
        ]
    },
    {
        id: 'recomendacoes',
        icon: <Zap className="w-4 h-4" />,
        title: 'Recomendações',
        summary: '3 ações prioritárias',
        details: [
            'Comparador de preço',
            'Precificação dinâmica',
            'Campanhas de awareness'
        ]
    }
];

export function Dashboard() {
    const [competitors, setCompetitors] = useState<Competitor[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCompetitorId, setSelectedCompetitorId] = useState<string | null>(null);
    // Todos os tópicos expandidos por padrão
    const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set(topics.map(t => t.id)));

    // Carregar dados
    useEffect(() => {
        fetch('/data/concorrentes.json')
            .then(res => res.json())
            .then(data => {
                const comps = Object.values(data.concorrentes) as Competitor[];
                setCompetitors(comps);
                const primeiro = comps.find(c => c.grupo === 'benchmark') || comps[0];
                if (primeiro) {
                    setSelectedCompetitorId(primeiro.id);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Erro ao carregar dados:', err);
                setLoading(false);
            });
    }, []);

    // Todos os concorrentes juntos
    const filteredCompetitors = useMemo(() => {
        return competitors.sort((a, b) => {
            const order = { benchmark: 0, diretos: 1, institucionais: 2 };
            return (order[a.grupo] || 3) - (order[b.grupo] || 3);
        });
    }, [competitors]);

    // Concorrente selecionado
    const selectedCompetitor = useMemo(() => {
        return competitors.find(c => c.id === selectedCompetitorId);
    }, [competitors, selectedCompetitorId]);

    // Calcular KPIs
    const kpis = useMemo(() => {
        const comAds = competitors.filter(c => (c.trafego_pago?.meta_ads?.anuncios_ativos || 0) > 0).length;
        const vulnCriticas = competitors.reduce((sum, c) =>
            sum + (c.vulnerabilidades?.filter(v => v.gravidade === 'alta').length || 0), 0
        );
        return {
            total: competitors.length,
            comAds,
            vulnCriticas,
        };
    }, [competitors]);

    // Gerar alertas
    const alerts: AlertItem[] = useMemo(() => {
        const items: AlertItem[] = [];

        const sanar = competitors.find(c => c.nome.toLowerCase().includes('sanar'));
        if (sanar && (sanar.trafego_pago?.meta_ads?.anuncios_ativos || 0) > 30) {
            items.push({
                id: '1',
                tipo: 'warning',
                mensagem: `Sanar está com alta atividade de anúncios (${sanar.trafego_pago?.meta_ads?.anuncios_ativos} ativos)`,
                data: new Date().toISOString(),
            });
        }

        const precosOcultos = competitors.filter(c => c.oferta && !c.oferta.preco_transparente).length;
        if (precosOcultos > 0) {
            items.push({
                id: '2',
                tipo: 'info',
                mensagem: `${precosOcultos} concorrentes não têm preço transparente no site`,
                data: new Date().toISOString(),
            });
        }

        return items;
    }, [competitors]);

    // Gerar oportunidades
    const opportunities: OpportunityItem[] = useMemo(() => {
        return [
            {
                id: '1',
                titulo: 'Gap de preço R$ 3k-4k',
                descricao: 'Poucos concorrentes na faixa de preço intermediária',
                impacto: 'alto',
                esforco: 'medio',
            },
            {
                id: '2',
                titulo: 'Transparência docente',
                descricao: 'Maioria não publica corpo docente completo',
                impacto: 'medio',
                esforco: 'baixo',
            },
            {
                id: '3',
                titulo: 'Garantia estendida',
                descricao: 'Nenhum oferece garantia superior a 7 dias',
                impacto: 'medio',
                esforco: 'baixo',
            },
        ];
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: '#000' }}>
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-orange-900 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
                    <p style={{ color: '#71717a' }}>Carregando inteligência competitiva...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="cenbrap-dashboard">
            {/* Sidebar - Agora só com Resumo Executivo */}
            <aside className="cenbrap-sidebar">
                {/* Logo */}
                <div className="cenbrap-sidebar-logo">
                    <div className="cenbrap-sidebar-logo-icon">C</div>
                    <div>
                        <div className="cenbrap-sidebar-logo-text">CENBRAP</div>
                        <div className="cenbrap-sidebar-logo-sub">Inteligência Competitiva</div>
                    </div>
                </div>

                {/* Resumo Executivo */}
                <div>
                    <div className="cenbrap-sidebar-section-title">Resumo Executivo</div>
                    <div className="space-y-2">
                        {topics.map((topic) => (
                            <div key={topic.id} className="sidebar-topic-group">
                                <button
                                    onClick={() => {
                                        const newExpanded = new Set(expandedTopics);
                                        if (newExpanded.has(topic.id)) {
                                            newExpanded.delete(topic.id);
                                        } else {
                                            newExpanded.add(topic.id);
                                        }
                                        setExpandedTopics(newExpanded);
                                    }}
                                    className={`cenbrap-nav-item w-full ${expandedTopics.has(topic.id) ? 'cenbrap-nav-item--active' : ''}`}
                                >
                                    {topic.icon}
                                    <span className="flex-1">{topic.title}</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${expandedTopics.has(topic.id) ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Conteúdo abaixo do título */}
                                <AnimatePresence>
                                    {expandedTopics.has(topic.id) && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-3 py-2 mt-1 mb-2 rounded-lg" style={{ background: '#111', border: '1px solid #222' }}>
                                                {topic.details.map((detail, idx) => (
                                                    <div key={idx} className="text-xs py-1 flex items-start gap-2" style={{ color: '#a1a1aa' }}>
                                                        <span style={{ color: '#ff7a00' }}>•</span>
                                                        {detail}
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats rápidos */}
                <div className="mt-6 p-4 rounded-xl bg-zinc-900/50 border border-white/[0.06]">
                    <div className="text-xs text-zinc-500 mb-3 font-semibold uppercase tracking-wider">Visão Geral</div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-zinc-400">Total</span>
                            <span className="text-sm font-semibold text-white">{kpis.total}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-zinc-400">Com Ads</span>
                            <span className="text-sm font-semibold text-amber-400">{kpis.comAds}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-zinc-400">Vuln. Críticas</span>
                            <span className="text-sm font-semibold text-red-400">{kpis.vulnCriticas}</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="cenbrap-main">
                {/* Header com Tabs tipo Chrome */}
                <header className="cenbrap-header" style={{ flexDirection: 'column', gap: '16px' }}>
                    <div className="cenbrap-header-title-group" style={{ width: '100%', justifyContent: 'space-between' }}>
                        <div className="flex items-center gap-4">
                            <div className="cenbrap-header-icon">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="cenbrap-header-title">Dashboard Competitivo</h1>
                                <p className="cenbrap-header-subtitle">Pós-graduação EAD Médica • Análise em tempo real</p>
                            </div>
                        </div>
                        <div className="cenbrap-header-meta">
                            <div className="cenbrap-date-badge">
                                <Calendar className="w-4 h-4" />
                                {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                            </div>
                            <div className="cenbrap-live-badge">
                                <span className="cenbrap-live-dot" />
                                Monitoramento Ativo
                            </div>
                        </div>
                    </div>

                    {/* Chrome Tabs - Navegação de Concorrentes */}
                    <div className="w-full">
                        <div className="text-xs text-zinc-500 mb-2 flex items-center gap-2">
                            <span>Concorrentes</span>
                            <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">{filteredCompetitors.length}</span>
                        </div>
                        <ChromeTabs
                            competitors={filteredCompetitors}
                            selectedId={selectedCompetitorId}
                            onSelect={setSelectedCompetitorId}
                        />
                    </div>
                </header>

                {/* KPIs com shadcn Card */}
                <div className="cenbrap-kpi-grid">
                    <Card className="cenbrap-kpi-card border-[var(--cenbrap-border)]">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="cenbrap-kpi-icon cenbrap-kpi-icon--primary">
                                <Target className="w-5 h-5" />
                            </div>
                            <div className="cenbrap-kpi-content">
                                <div className="cenbrap-kpi-label">Concorrentes</div>
                                <div className="cenbrap-kpi-value">{kpis.total}</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="cenbrap-kpi-card border-[var(--cenbrap-border)]">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="cenbrap-kpi-icon cenbrap-kpi-icon--accent">
                                <Megaphone className="w-5 h-5" />
                            </div>
                            <div className="cenbrap-kpi-content">
                                <div className="cenbrap-kpi-label">Com Ads Ativos</div>
                                <div className="cenbrap-kpi-value">{kpis.comAds}</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="cenbrap-kpi-card border-[var(--cenbrap-border)]">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="cenbrap-kpi-icon cenbrap-kpi-icon--warning">
                                <ShieldAlert className="w-5 h-5" />
                            </div>
                            <div className="cenbrap-kpi-content">
                                <div className="cenbrap-kpi-label">Vuln. Críticas</div>
                                <div className="cenbrap-kpi-value">{kpis.vulnCriticas}</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="cenbrap-kpi-card border-[var(--cenbrap-border)]">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="cenbrap-kpi-icon cenbrap-kpi-icon--success">
                                <Activity className="w-5 h-5" />
                            </div>
                            <div className="cenbrap-kpi-content">
                                <div className="cenbrap-kpi-label">Status</div>
                                <div className="cenbrap-kpi-value" style={{ fontSize: '18px', marginTop: '4px' }}>Ativo</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Grid com shadcn Card */}
                <div className="cenbrap-content-grid">
                    <Card className="cenbrap-card border-[var(--cenbrap-border)]">
                        <CardHeader className="cenbrap-card-header pb-2">
                            <CardTitle className="cenbrap-card-title text-base">Comparativo: {selectedCompetitor?.nome || 'Selecionado'} vs Média</CardTitle>
                        </CardHeader>
                        <CardContent className="cenbrap-card-body pt-0">
                            <RadarComparison
                                competitors={competitors}
                                selectedCompetitor={selectedCompetitor}
                            />
                        </CardContent>
                    </Card>

                    <Card className="cenbrap-card border-[var(--cenbrap-border)]">
                        <CardHeader className="cenbrap-card-header pb-2">
                            <CardTitle className="cenbrap-card-title text-base">Distribuição de Preços</CardTitle>
                        </CardHeader>
                        <CardContent className="cenbrap-card-body pt-0">
                            <PriceDistribution competitors={competitors} />
                        </CardContent>
                    </Card>

                    <Card className="cenbrap-card border-[var(--cenbrap-border)]">
                        <CardHeader className="cenbrap-card-header pb-2">
                            <CardTitle className="cenbrap-card-title text-base">Matriz de Posicionamento</CardTitle>
                            <span className="cenbrap-card-subtitle">Preço x Credibilidade</span>
                        </CardHeader>
                        <CardContent className="cenbrap-card-body pt-0">
                            <PositioningMatrix competitors={competitors} />
                        </CardContent>
                    </Card>

                    <Card className="cenbrap-card border-[var(--cenbrap-border)]">
                        <CardHeader className="cenbrap-card-header pb-2">
                            <CardTitle className="cenbrap-card-title text-base">Meta Ads - Anúncios Ativos</CardTitle>
                            <span className="cenbrap-card-subtitle">Top 10 concorrentes</span>
                        </CardHeader>
                        <CardContent className="cenbrap-card-body pt-0">
                            <AdsInvestmentChart competitors={competitors} />
                        </CardContent>
                    </Card>
                </div>

                {/* Alerts Section com shadcn Card e Badge */}
                {alerts.length > 0 && (
                    <div className="cenbrap-section">
                        <h3 className="cenbrap-section-title">Alertas</h3>
                        <div className="cenbrap-alert-list">
                            {alerts.map((alert) => (
                                <Card key={alert.id} className={`cenbrap-alert-item cenbrap-alert-item--${alert.tipo} border-[var(--cenbrap-border)]`}>
                                    <CardContent className="p-3 flex items-center gap-3">
                                        <div className={`cenbrap-alert-icon cenbrap-alert-icon--${alert.tipo}`}>
                                            <AlertTriangle className="w-4 h-4" />
                                        </div>
                                        <div className="cenbrap-alert-content">
                                            <p className="cenbrap-alert-text">{alert.mensagem}</p>
                                        </div>
                                        <Badge
                                            variant={alert.tipo === 'warning' ? 'destructive' : 'secondary'}
                                            className="ml-auto"
                                        >
                                            {alert.tipo === 'warning' ? 'Urgente' : 'Info'}
                                        </Badge>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Opportunities Section com shadcn Card e Badge */}
                <div className="cenbrap-section">
                    <h3 className="cenbrap-section-title">Oportunidades Identificadas</h3>
                    <div className="cenbrap-opportunity-grid">
                        {opportunities.map((opp) => (
                            <Card key={opp.id} className="cenbrap-opportunity-card border-[var(--cenbrap-border)]">
                                <CardContent className="p-4">
                                    <div className="cenbrap-opportunity-header">
                                        <div className="cenbrap-opportunity-icon">
                                            <Zap className="w-4 h-4" />
                                        </div>
                                        <Badge
                                            variant={opp.impacto === 'alto' ? 'default' : opp.impacto === 'medio' ? 'warning' : 'secondary'}
                                            className="text-xs"
                                        >
                                            Impacto {opp.impacto}
                                        </Badge>
                                    </div>
                                    <h4 className="cenbrap-opportunity-title">{opp.titulo}</h4>
                                    <p className="cenbrap-opportunity-desc">{opp.descricao}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Competitor Detail - ALL SECTIONS EXPANDED */}
                {selectedCompetitor && (
                    <div className="cenbrap-section" style={{ marginTop: '32px' }}>
                        <h3 className="cenbrap-section-title">Análise Detalhada: {selectedCompetitor.nome}</h3>

                        {/* Detail Header */}
                        <div className="cenbrap-detail-header">
                            <div className="cenbrap-detail-header-top">
                                <div className="cenbrap-detail-title-group">
                                    <div className="cenbrap-detail-avatar">
                                        {selectedCompetitor.nome.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <h2 className="cenbrap-detail-title">{selectedCompetitor.nome}</h2>
                                        <p className="cenbrap-detail-subtitle">
                                            <a href={`https://${selectedCompetitor.url}`} target="_blank" rel="noopener noreferrer">
                                                {selectedCompetitor.url}
                                            </a>
                                        </p>
                                    </div>
                                </div>
                                <div className="cenbrap-detail-badges">
                                    <span className="cenbrap-detail-badge">{selectedCompetitor.grupo}</span>
                                    {selectedCompetitor.ficha_cadastral?.credenciamento_mec?.toLowerCase().includes('credenciada') && (
                                        <span className="cenbrap-detail-badge cenbrap-detail-badge--highlight">MEC</span>
                                    )}
                                    <PriceRangeBadge value={selectedCompetitor.oferta?.valor_total} />
                                </div>
                            </div>
                            <div className="cenbrap-detail-stats">
                                <div className="cenbrap-detail-stat">
                                    <div className="cenbrap-detail-stat-value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {selectedCompetitor.oferta?.valor_total ? (
                                            <PriceRangeBadge value={selectedCompetitor.oferta.valor_total} />
                                        ) : (
                                            <span className="text-zinc-500">?</span>
                                        )}
                                    </div>
                                    <div className="cenbrap-detail-stat-label">Preço</div>
                                </div>
                                <div className="cenbrap-detail-stat">
                                    <div className="cenbrap-detail-stat-value">
                                        {selectedCompetitor.trafego_pago?.meta_ads?.anuncios_ativos || 0}
                                    </div>
                                    <div className="cenbrap-detail-stat-label">Anúncios</div>
                                </div>
                                <div className="cenbrap-detail-stat">
                                    <div className="cenbrap-detail-stat-value">
                                        {selectedCompetitor.vulnerabilidades?.length || 0}
                                    </div>
                                    <div className="cenbrap-detail-stat-label">Vulnerabilidades</div>
                                </div>
                                <div className="cenbrap-detail-stat">
                                    <div className="cenbrap-detail-stat-value">
                                        {selectedCompetitor.ficha_cadastral?.ano_fundacao || 'N/A'}
                                    </div>
                                    <div className="cenbrap-detail-stat-label">Fundação</div>
                                </div>
                            </div>
                        </div>

                        {/* EXPANDED SECTIONS - ALL VISIBLE */}
                        <div className="cenbrap-expanded-sections">

                            {/* FICHA SECTION */}
                            <div className="cenbrap-section-card">
                                <div className="cenbrap-section-card-header">
                                    <div className="cenbrap-section-card-icon">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <h4 className="cenbrap-section-card-title">Ficha Cadastral</h4>
                                </div>
                                <div className="cenbrap-section-card-body">
                                    <div className="cenbrap-info-grid">
                                        <div className="cenbrap-info-group">
                                            <div className="cenbrap-info-group-title">Institucional</div>
                                            <div className="cenbrap-info-row">
                                                <span className="cenbrap-info-label">Nome Completo</span>
                                                <span className="cenbrap-info-value">{selectedCompetitor.ficha_cadastral?.nome_completo || selectedCompetitor.nome}</span>
                                            </div>
                                            <div className="cenbrap-info-row">
                                                <span className="cenbrap-info-label">Credenciamento</span>
                                                <span className="cenbrap-info-value">{selectedCompetitor.ficha_cadastral?.credenciamento_mec || 'N/A'}</span>
                                            </div>
                                            <div className="cenbrap-info-row">
                                                <span className="cenbrap-info-label">Ano de Fundação</span>
                                                <span className="cenbrap-info-value">{selectedCompetitor.ficha_cadastral?.ano_fundacao || 'N/A'}</span>
                                            </div>
                                            <div className="cenbrap-info-row">
                                                <span className="cenbrap-info-label">Alunos Formados</span>
                                                <span className="cenbrap-info-value">{selectedCompetitor.ficha_cadastral?.alunos_formados || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <div className="cenbrap-info-group">
                                            <div className="cenbrap-info-group-title">Operacional</div>
                                            <div className="cenbrap-info-row">
                                                <span className="cenbrap-info-label">Modalidade</span>
                                                <span className="cenbrap-info-value">{selectedCompetitor.ficha_cadastral?.modalidade?.join(', ') || 'N/A'}</span>
                                            </div>
                                            <div className="cenbrap-info-row">
                                                <span className="cenbrap-info-label">Sede</span>
                                                <span className="cenbrap-info-value">{selectedCompetitor.ficha_cadastral?.sede || 'N/A'}</span>
                                            </div>
                                            <div className="cenbrap-info-row">
                                                <span className="cenbrap-info-label">Natureza Jurídica</span>
                                                <span className="cenbrap-info-value">{selectedCompetitor.ficha_cadastral?.natureza_juridica || 'N/A'}</span>
                                            </div>
                                            <div className="cenbrap-info-row">
                                                <span className="cenbrap-info-label">Docentes Destacados</span>
                                                <span className="cenbrap-info-value">{selectedCompetitor.autoridade?.professores_destacados?.length || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* PREÇOS SECTION */}
                            <div className="cenbrap-section-card">
                                <div className="cenbrap-section-card-header">
                                    <div className="cenbrap-section-card-icon">
                                        <DollarSign className="w-5 h-5" />
                                    </div>
                                    <h4 className="cenbrap-section-card-title">Preços e Condições</h4>
                                </div>
                                <div className="cenbrap-section-card-body">
                                    {selectedCompetitor.oferta ? (
                                        <div className="cenbrap-info-grid">
                                            <div className="cenbrap-info-group">
                                                <div className="cenbrap-info-group-title">Valores</div>
                                                <div className="cenbrap-info-row">
                                                    <span className="cenbrap-info-label">Investimento Total</span>
                                                    <span className="cenbrap-info-value" style={{ fontWeight: 600, color: '#e4e4e7' }}>
                                                        {selectedCompetitor.oferta.valor_total
                                                            ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedCompetitor.oferta.valor_total)
                                                            : 'Não informado'}
                                                    </span>
                                                </div>
                                                <div className="cenbrap-info-row">
                                                    <span className="cenbrap-info-label">À Vista</span>
                                                    <span className="cenbrap-info-value">
                                                        {selectedCompetitor.oferta.preco_avista
                                                            ? (typeof selectedCompetitor.oferta.preco_avista === 'number'
                                                                ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedCompetitor.oferta.preco_avista)
                                                                : selectedCompetitor.oferta.preco_avista)
                                                            : '-'}
                                                    </span>
                                                </div>
                                                <div className="cenbrap-info-row">
                                                    <span className="cenbrap-info-label">Parcelado</span>
                                                    <span className="cenbrap-info-value">{selectedCompetitor.oferta.preco_parcelado || '-'}</span>
                                                </div>
                                                {selectedCompetitor.oferta.desconto_a_vista && (
                                                    <div className="cenbrap-info-row">
                                                        <span className="cenbrap-info-label" style={{ color: '#22c55e' }}>Desconto à Vista</span>
                                                        <span className="cenbrap-info-value" style={{ color: '#22c55e' }}>{selectedCompetitor.oferta.desconto_a_vista}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="cenbrap-info-group">
                                                <div className="cenbrap-info-group-title">Detalhes e Condições</div>
                                                {selectedCompetitor.oferta.observacao_preco && selectedCompetitor.oferta.observacao_preco !== "PESQUISANDO" && (
                                                    <div className="mb-3 p-2 rounded bg-zinc-900/50 border border-zinc-800">
                                                        <p className="text-xs text-zinc-400 mb-1">Observações de Pagamento:</p>
                                                        <p className="text-sm text-zinc-200">{selectedCompetitor.oferta.observacao_preco}</p>
                                                    </div>
                                                )}
                                                {selectedCompetitor.oferta.observacao_preco === "PESQUISANDO" && (
                                                    <div className="mb-3 p-2 rounded bg-yellow-900/20 border border-yellow-800/50">
                                                        <p className="text-sm text-yellow-500">Valor sob consulta / Em pesquisa</p>
                                                    </div>
                                                )}

                                                <div className="cenbrap-info-row">
                                                    <span className="cenbrap-info-label">Garantia</span>
                                                    <span className="cenbrap-info-value">{selectedCompetitor.oferta.garantia || '-'}</span>
                                                </div>
                                                <div className="cenbrap-info-row">
                                                    <span className="cenbrap-info-label">Transparência</span>
                                                    <span className="cenbrap-info-value" style={{ color: selectedCompetitor.oferta.preco_transparente ? '#22c55e' : '#ef4444' }}>
                                                        {selectedCompetitor.oferta.preco_transparente ? 'Sim' : 'Não'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p style={{ color: '#71717a', textAlign: 'center', padding: '20px' }}>Dados de preço não disponíveis</p>
                                    )}
                                </div>
                            </div>

                            {/* ADS SECTION */}
                            <div className="cenbrap-section-card">
                                <div className="cenbrap-section-card-header">
                                    <div className="cenbrap-section-card-icon">
                                        <Megaphone className="w-5 h-5" />
                                    </div>
                                    <h4 className="cenbrap-section-card-title">Tráfego Pago</h4>
                                </div>
                                <div className="cenbrap-section-card-body">
                                    <div className="cenbrap-info-grid">
                                        <div className="cenbrap-info-group">
                                            <div className="cenbrap-info-group-title">Meta Ads</div>
                                            <div className="cenbrap-info-row">
                                                <span className="cenbrap-info-label">Anúncios Ativos</span>
                                                <span className="cenbrap-info-value">{selectedCompetitor.trafego_pago?.meta_ads?.anuncios_ativos || 0}</span>
                                            </div>
                                            <div className="cenbrap-info-row">
                                                <span className="cenbrap-info-label">Investimento Estimado</span>
                                                <span className="cenbrap-info-value">{selectedCompetitor.trafego_pago?.meta_ads?.investimento_estimado || 'N/A'}</span>
                                            </div>
                                            <div className="cenbrap-info-row">
                                                <span className="cenbrap-info-label">Formatos</span>
                                                <span className="cenbrap-info-value">{selectedCompetitor.trafego_pago?.meta_ads?.formatos?.join(', ') || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <div className="cenbrap-info-group">
                                            <div className="cenbrap-info-group-title">Google Ads</div>
                                            <div className="cenbrap-info-row">
                                                <span className="cenbrap-info-label">Anúncios Ativos</span>
                                                <span className="cenbrap-info-value">{selectedCompetitor.trafego_pago?.google_ads?.anuncios_ativos ? 'Sim' : 'Não'}</span>
                                            </div>
                                            <div className="cenbrap-info-row">
                                                <span className="cenbrap-info-label">Palavras-chave</span>
                                                <span className="cenbrap-info-value">{selectedCompetitor.trafego_pago?.google_ads?.palavras_chave?.join(', ') || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* DIGITAL SECTION */}
                            <div className="cenbrap-section-card">
                                <div className="cenbrap-section-card-header">
                                    <div className="cenbrap-section-card-icon">
                                        <Globe className="w-5 h-5" />
                                    </div>
                                    <h4 className="cenbrap-section-card-title">Presença Digital</h4>
                                </div>
                                <div className="cenbrap-section-card-body">
                                    <div className="cenbrap-social-grid">
                                        {selectedCompetitor.digital?.site?.url && (
                                            <a href={selectedCompetitor.digital.site.url} target="_blank" rel="noopener noreferrer" className="cenbrap-social-card">
                                                <div className="cenbrap-social-icon cenbrap-social-icon--site"><Globe className="w-5 h-5" /></div>
                                                <div className="cenbrap-social-info">
                                                    <div className="cenbrap-social-name">Website</div>
                                                    <div className="cenbrap-social-stats">{selectedCompetitor.url}</div>
                                                </div>
                                            </a>
                                        )}
                                        {(selectedCompetitor.digital?.redes_sociais?.instagram?.url || selectedCompetitor.digital?.instagram?.url) && (
                                            <a href={selectedCompetitor.digital?.redes_sociais?.instagram?.url || selectedCompetitor.digital?.instagram?.url} target="_blank" rel="noopener noreferrer" className="cenbrap-social-card">
                                                <div className="cenbrap-social-icon cenbrap-social-icon--instagram"><Instagram className="w-5 h-5" /></div>
                                                <div className="cenbrap-social-info">
                                                    <div className="cenbrap-social-name">Instagram</div>
                                                    <div className="cenbrap-social-stats">{selectedCompetitor.digital?.redes_sociais?.instagram?.seguidores || selectedCompetitor.digital?.instagram?.seguidores || 'N/A'}</div>
                                                </div>
                                            </a>
                                        )}
                                        {(selectedCompetitor.digital?.redes_sociais?.linkedin?.url || selectedCompetitor.digital?.linkedin?.url) && (
                                            <a href={selectedCompetitor.digital?.redes_sociais?.linkedin?.url || selectedCompetitor.digital?.linkedin?.url} target="_blank" rel="noopener noreferrer" className="cenbrap-social-card">
                                                <div className="cenbrap-social-icon cenbrap-social-icon--linkedin"><Linkedin className="w-5 h-5" /></div>
                                                <div className="cenbrap-social-info">
                                                    <div className="cenbrap-social-name">LinkedIn</div>
                                                    <div className="cenbrap-social-stats">{selectedCompetitor.digital?.redes_sociais?.linkedin?.seguidores || selectedCompetitor.digital?.linkedin?.seguidores || 'N/A'}</div>
                                                </div>
                                            </a>
                                        )}
                                        {(selectedCompetitor.digital?.redes_sociais?.facebook?.url || selectedCompetitor.digital?.facebook?.url) && (
                                            <a href={selectedCompetitor.digital?.redes_sociais?.facebook?.url || selectedCompetitor.digital?.facebook?.url} target="_blank" rel="noopener noreferrer" className="cenbrap-social-card">
                                                <div className="cenbrap-social-icon cenbrap-social-icon--facebook"><Facebook className="w-5 h-5" /></div>
                                                <div className="cenbrap-social-info">
                                                    <div className="cenbrap-social-name">Facebook</div>
                                                    <div className="cenbrap-social-stats">{selectedCompetitor.digital?.redes_sociais?.facebook?.seguidores || selectedCompetitor.digital?.facebook?.seguidores || 'N/A'}</div>
                                                </div>
                                            </a>
                                        )}
                                        {(selectedCompetitor.digital?.redes_sociais?.youtube?.url || selectedCompetitor.digital?.youtube?.url) && (
                                            <a href={selectedCompetitor.digital?.redes_sociais?.youtube?.url || selectedCompetitor.digital?.youtube?.url} target="_blank" rel="noopener noreferrer" className="cenbrap-social-card">
                                                <div className="cenbrap-social-icon cenbrap-social-icon--youtube"><Youtube className="w-5 h-5" /></div>
                                                <div className="cenbrap-social-info">
                                                    <div className="cenbrap-social-name">YouTube</div>
                                                    <div className="cenbrap-social-stats">{selectedCompetitor.digital?.redes_sociais?.youtube?.inscritos || selectedCompetitor.digital?.youtube?.inscritos || 'N/A'}</div>
                                                </div>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* VULNERABILITIES SECTION */}
                            <div className="cenbrap-section-card">
                                <div className="cenbrap-section-card-header">
                                    <div className="cenbrap-section-card-icon">
                                        <ShieldAlert className="w-5 h-5" />
                                    </div>
                                    <h4 className="cenbrap-section-card-title">Vulnerabilidades ({selectedCompetitor.vulnerabilidades?.length || 0})</h4>
                                </div>
                                <div className="cenbrap-section-card-body">
                                    {selectedCompetitor.vulnerabilidades?.length === 0 ? (
                                        <div className="text-center py-8">
                                            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                                                <ShieldAlert className="w-8 h-8" style={{ color: '#22c55e' }} />
                                            </div>
                                            <p style={{ color: '#fff', fontWeight: 500 }}>Nenhuma vulnerabilidade crítica</p>
                                            <p style={{ color: '#71717a', fontSize: '14px' }}>Este concorrente não apresenta vulnerabilidades significativas.</p>
                                        </div>
                                    ) : (
                                        <div>
                                            {selectedCompetitor.vulnerabilidades?.map((vuln, index) => (
                                                <div key={index} className={`cenbrap-vuln-card cenbrap-vuln-card--${vuln.gravidade}`}>
                                                    <div className="cenbrap-vuln-header">
                                                        <div className="cenbrap-vuln-number">{index + 1}</div>
                                                        <span className="cenbrap-vuln-severity">{vuln.gravidade}</span>
                                                    </div>
                                                    <h4 className="cenbrap-vuln-title">{vuln.tipo.replace(/_/g, ' ')}</h4>
                                                    <p className="cenbrap-vuln-desc">{vuln.descricao}</p>
                                                    {vuln.como_atacar && (
                                                        <div className="cenbrap-vuln-actions">
                                                            <div className="cenbrap-vuln-action cenbrap-vuln-action--attack">
                                                                <strong>Como Explorar:</strong><br />
                                                                {vuln.como_atacar}
                                                            </div>
                                                            <div className="cenbrap-vuln-action cenbrap-vuln-action--defend">
                                                                <strong>Contra-ataque:</strong><br />
                                                                {vuln.contra_ataque}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
