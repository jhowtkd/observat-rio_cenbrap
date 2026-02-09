import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FileText, 
    DollarSign, 
    Target, 
    Smartphone, 
    AlertTriangle,
    ExternalLink,
    Calendar,
    Shield,
    AlertCircle,
    CheckCircle2,
    Crown
} from 'lucide-react';
import type { Competitor } from '../../types';
import { FichaTab } from './FichaTab';
import { PrecoTab } from './PrecoTab';
import { AdsTab } from './AdsTab';
import { VulnerabilitiesTab } from './VulnerabilitiesTab';

interface CompetitorDetailProps {
    competitor: Competitor;
    mediaPrecoMercado?: number;
}

type TabId = 'ficha' | 'preco' | 'ads' | 'digital' | 'vulnerabilities';

export function CompetitorDetail({ competitor, mediaPrecoMercado }: CompetitorDetailProps) {
    const [activeTab, setActiveTab] = useState<TabId>('ficha');

    const tabs: { id: TabId; label: string; icon: React.ReactNode; count?: number }[] = [
        { id: 'ficha', label: 'Ficha', icon: <FileText className="w-4 h-4" /> },
        { id: 'preco', label: 'Preços', icon: <DollarSign className="w-4 h-4" /> },
        { id: 'ads', label: 'Ads', icon: <Target className="w-4 h-4" /> },
        { id: 'digital', label: 'Digital', icon: <Smartphone className="w-4 h-4" /> },
        { id: 'vulnerabilities', label: 'Fraquezas', icon: <AlertTriangle className="w-4 h-4" />, count: competitor.vulnerabilidades?.length },
    ];

    const statusIcons = {
        completa: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
        parcial: <AlertCircle className="w-4 h-4 text-amber-400" />,
        pendente: <AlertCircle className="w-4 h-4 text-zinc-500" />,
    };

    const statusLabels = {
        completa: 'Coleta completa',
        parcial: 'Coleta parcial',
        pendente: 'Coleta pendente',
    };

    const isReferencia = competitor.grupo === 'benchmark';

    return (
        <div className={`bg-zinc-900/30 rounded-2xl border overflow-hidden ${isReferencia ? 'border-cyan-500/30' : 'border-white/[0.06]'}`}>
            {/* Header */}
            <div className={`p-6 border-b ${isReferencia ? 'bg-cyan-500/5 border-cyan-500/20' : 'border-white/[0.06]'}`}>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                            isReferencia 
                                ? 'bg-gradient-to-br from-cyan-500 to-cyan-600' 
                                : 'bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-500/30'
                        }`}>
                            {isReferencia ? (
                                <Crown className="w-6 h-6 text-white" />
                            ) : (
                                <span className="text-xl font-bold text-cyan-400">
                                    {competitor.nome.slice(0, 2).toUpperCase()}
                                </span>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold text-white">{competitor.nome}</h2>
                                {isReferencia && (
                                    <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs font-medium rounded-full border border-cyan-500/30">
                                        REFERÊNCIA
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                                <a 
                                    href={`https://${competitor.url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                                >
                                    {competitor.url}
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                                <span className="text-zinc-600">•</span>
                                <span className="text-sm text-zinc-500 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    Atualizado em {new Date(competitor.ultima_atualizacao).toLocaleDateString('pt-BR')}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Status Coleta */}
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/50 border border-white/[0.06]">
                            {statusIcons[competitor.status_coleta]}
                            <span className="text-xs text-zinc-400">
                                {statusLabels[competitor.status_coleta]}
                            </span>
                        </div>

                        {/* Prioridade */}
                        <span className={`text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-lg border ${
                            competitor.prioridade === 'alta' 
                                ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                : competitor.prioridade === 'media'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                            Prioridade {competitor.prioridade}
                        </span>

                        {/* MEC Badge */}
                        {competitor.ficha_cadastral?.credenciamento_mec?.includes('Credenciada') && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                <Shield className="w-4 h-4 text-emerald-400" />
                                <span className="text-xs font-semibold text-emerald-400">MEC</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-4 mt-6">
                    <QuickStat 
                        label="Preço"
                        value={competitor.oferta?.valor_total 
                            ? `R$ ${(competitor.oferta.valor_total / 1000).toFixed(1)}k`
                            : 'N/A'
                        }
                        color="cyan"
                    />
                    <QuickStat 
                        label="Anúncios Ativos"
                        value={competitor.trafego_pago?.meta_ads?.anuncios_ativos?.toString() || '0'}
                        color="amber"
                    />
                    <QuickStat 
                        label="Seguidores"
                        value={competitor.digital?.instagram?.seguidores || 'N/A'}
                        color="purple"
                    />
                    <QuickStat 
                        label="Fraquezas"
                        value={competitor.vulnerabilidades?.length?.toString() || '0'}
                        color="red"
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-white/[0.06]">
                <div className="flex px-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                relative px-4 py-4 flex items-center gap-2 text-sm font-medium transition-colors
                                ${activeTab === tab.id 
                                    ? 'text-cyan-400' 
                                    : 'text-zinc-500 hover:text-zinc-300'
                                }
                            `}
                        >
                            {tab.icon}
                            {tab.label}
                            {tab.count !== undefined && tab.count > 0 && (
                                <span className={`
                                    ml-1 px-1.5 py-0.5 rounded text-[10px] font-semibold
                                    ${activeTab === tab.id
                                        ? 'bg-cyan-500/20 text-cyan-400'
                                        : 'bg-zinc-800 text-zinc-500'
                                    }
                                `}>
                                    {tab.count}
                                </span>
                            )}
                            
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'ficha' && <FichaTab competitor={competitor} />}
                        {activeTab === 'preco' && <PrecoTab competitor={competitor} mediaMercado={mediaPrecoMercado} />}
                        {activeTab === 'ads' && <AdsTab competitor={competitor} />}
                        {activeTab === 'digital' && <DigitalTabPlaceholder competitor={competitor} />}
                        {activeTab === 'vulnerabilities' && <VulnerabilitiesTab competitor={competitor} />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

function QuickStat({ label, value, color }: { label: string; value: string; color: 'cyan' | 'amber' | 'purple' | 'red' }) {
    const colors = {
        cyan: 'text-cyan-400',
        amber: 'text-amber-400',
        purple: 'text-purple-400',
        red: 'text-red-400',
    };

    return (
        <div className="p-3 rounded-lg bg-zinc-800/30 border border-white/[0.06]">
            <div className="text-xs text-zinc-500 mb-1">{label}</div>
            <div className={`text-lg font-semibold ${colors[color]}`}>{value}</div>
        </div>
    );
}

// Placeholder para a aba Digital
function DigitalTabPlaceholder({ competitor }: { competitor: Competitor }) {
    return (
        <div className="space-y-6">
            <div className="p-5 rounded-xl bg-zinc-900/30 border border-white/[0.06]">
                <h4 className="text-sm font-semibold text-zinc-400 mb-4 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-pink-400" />
                    Presença Digital
                </h4>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {competitor.digital?.instagram?.seguidores && (
                        <div className="p-4 rounded-lg bg-zinc-800/30 text-center">
                            <div className="text-2xl mb-1">📸</div>
                            <div className="text-lg font-bold text-white">{competitor.digital.instagram.seguidores}</div>
                            <div className="text-xs text-zinc-500">Instagram</div>
                            {competitor.digital.instagram.engajamento && (
                                <div className="text-xs text-pink-400 mt-1">
                                    Eng. {competitor.digital.instagram.engajamento}
                                </div>
                            )}
                        </div>
                    )}
                    
                    {competitor.digital?.facebook?.seguidores && (
                        <div className="p-4 rounded-lg bg-zinc-800/30 text-center">
                            <div className="text-2xl mb-1">f</div>
                            <div className="text-lg font-bold text-white">{competitor.digital.facebook.seguidores}</div>
                            <div className="text-xs text-zinc-500">Facebook</div>
                        </div>
                    )}
                    
                    {competitor.digital?.linkedin?.seguidores && (
                        <div className="p-4 rounded-lg bg-zinc-800/30 text-center">
                            <div className="text-2xl mb-1">in</div>
                            <div className="text-lg font-bold text-white">{competitor.digital.linkedin.seguidores}</div>
                            <div className="text-xs text-zinc-500">LinkedIn</div>
                        </div>
                    )}
                    
                    {competitor.digital?.youtube?.inscritos && (
                        <div className="p-4 rounded-lg bg-zinc-800/30 text-center">
                            <div className="text-2xl mb-1">▶</div>
                            <div className="text-lg font-bold text-white">{competitor.digital.youtube.inscritos}</div>
                            <div className="text-xs text-zinc-500">YouTube</div>
                        </div>
                    )}
                </div>

                {competitor.digital?.fonte && (
                    <div className="mt-4 pt-4 border-t border-white/[0.06]">
                        <div className="text-xs text-zinc-500">
                            Fonte: Coleta em {new Date(competitor.digital.fonte.data_coleta).toLocaleDateString('pt-BR')}
                        </div>
                    </div>
                )}
            </div>

            {/* SEO e Blog */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-zinc-800/30 border border-white/[0.06]">
                    <div className="text-xs text-zinc-500 mb-1">SEO Orgânico</div>
                    <div className="text-sm font-medium text-zinc-300">
                        {competitor.digital?.seo_organico || 'Não avaliado'}
                    </div>
                </div>
                <div className="p-4 rounded-lg bg-zinc-800/30 border border-white/[0.06]">
                    <div className="text-xs text-zinc-500 mb-1">Blog Ativo</div>
                    <div className={`text-sm font-medium ${competitor.digital?.blog ? 'text-emerald-400' : 'text-zinc-500'}`}>
                        {competitor.digital?.blog ? 'Sim' : 'Não'}
                    </div>
                </div>
            </div>
        </div>
    );
}
