import { Target, BarChart3, ExternalLink, FileText, Image, Video } from 'lucide-react';
import type { Competitor } from '../../types';
import { SourceBadge } from '../shared/SourceBadge';

interface AdsTabProps {
    competitor: Competitor;
}

export function AdsTab({ competitor }: AdsTabProps) {
    const metaAds = competitor.trafego_pago?.meta_ads;
    const googleAds = competitor.trafego_pago?.google_ads;

    if (!metaAds && !googleAds) {
        return (
            <div className="p-8 text-center">
                <div className="text-zinc-500 mb-2">Dados de anúncios online não disponíveis</div>
                <div className="text-xs text-zinc-600">
                    Este concorrente pode não estar investindo em anúncios ou os dados ainda não foram coletados.
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Meta Ads */}
            {metaAds && (
                <div className="p-5 rounded-xl bg-gradient-to-br from-blue-500/5 to-blue-500/0 border border-blue-500/20">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-semibold text-blue-400 flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Meta Ads (Facebook/Instagram)
                        </h4>
                        <a 
                            href={competitor.fontes.meta_ads_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                        >
                            Ver biblioteca
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                        <StatCard 
                            label="Anúncios Ativos"
                            value={metaAds.anuncios_ativos}
                            color="blue"
                        />
                        <StatCard 
                            label="Investimento Estimado"
                            value={metaAds.investimento_estimado}
                            color="amber"
                        />
                        <StatCard 
                            label="Formatos"
                            value={metaAds.formatos?.length || 0}
                            color="purple"
                        />
                        <StatCard 
                            label="Ângulos de Copy"
                            value={metaAds.angulos_copy?.length || 0}
                            color="cyan"
                        />
                    </div>

                    {/* Formatos */}
                    {metaAds.formatos && metaAds.formatos.length > 0 && (
                        <div className="mb-4">
                            <div className="text-xs text-zinc-500 mb-2">Formatos utilizados</div>
                            <div className="flex flex-wrap gap-2">
                                {metaAds.formatos.map((formato, i) => (
                                    <span 
                                        key={i}
                                        className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                    >
                                        {formato === 'Video' && <Video className="w-3 h-3 inline mr-1" />}
                                        {formato === 'Imagem' && <Image className="w-3 h-3 inline mr-1" />}
                                        {formato === 'Carrossel' && <FileText className="w-3 h-3 inline mr-1" />}
                                        {formato}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Ângulos de Copy */}
                    {metaAds.angulos_copy && metaAds.angulos_copy.length > 0 && (
                        <div className="mb-4">
                            <div className="text-xs text-zinc-500 mb-2">Ângulos de Copy identificados</div>
                            <ul className="space-y-1.5">
                                {metaAds.angulos_copy.map((angulo, i) => (
                                    <li 
                                        key={i}
                                        className="text-sm text-zinc-300 flex items-start gap-2 p-2 rounded-lg bg-zinc-900/50"
                                    >
                                        <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-medium shrink-0">
                                            {i + 1}
                                        </span>
                                        {angulo}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Landing Pages */}
                    {metaAds.landing_pages && metaAds.landing_pages.length > 0 && (
                        <div>
                            <div className="text-xs text-zinc-500 mb-2">Landing Pages de destino</div>
                            <div className="space-y-1">
                                {metaAds.landing_pages.map((lp, i) => (
                                    <a 
                                        key={i}
                                        href={`https://${lp}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                                    >
                                        {lp}
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {metaAds.fonte && (
                        <div className="mt-4 pt-4 border-t border-white/[0.06]">
                            <SourceBadge source={metaAds.fonte} compact />
                        </div>
                    )}
                </div>
            )}

            {/* Google Ads */}
            {googleAds && (
                <div className="p-5 rounded-xl bg-gradient-to-br from-red-500/5 to-red-500/0 border border-red-500/20">
                    <h4 className="text-sm font-semibold text-red-400 mb-4 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Google Ads
                    </h4>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 mb-4">
                        <span className="text-sm text-zinc-400">Status</span>
                        <span className={`text-sm font-medium ${googleAds.anuncios_ativos ? 'text-emerald-400' : 'text-zinc-500'}`}>
                            {googleAds.anuncios_ativos ? 'Anunciando' : 'Sem anúncios ativos'}
                        </span>
                    </div>

                    {googleAds.palavras_chave && googleAds.palavras_chave.length > 0 && (
                        <div>
                            <div className="text-xs text-zinc-500 mb-2">Palavras-chave identificadas</div>
                            <div className="flex flex-wrap gap-1.5">
                                {googleAds.palavras_chave.map((kw, i) => (
                                    <span 
                                        key={i}
                                        className="px-2 py-1 rounded text-xs bg-zinc-800 text-zinc-400 border border-white/[0.06]"
                                    >
                                        {kw}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {googleAds.fonte && (
                        <div className="mt-4 pt-4 border-t border-white/[0.06]">
                            <SourceBadge source={googleAds.fonte} compact />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

interface StatCardProps {
    label: string;
    value: string | number | undefined;
    color: 'blue' | 'amber' | 'purple' | 'cyan';
}

function StatCard({ label, value, color }: StatCardProps) {
    const colors = {
        blue: 'bg-blue-500/10 text-blue-400',
        amber: 'bg-amber-500/10 text-amber-400',
        purple: 'bg-purple-500/10 text-purple-400',
        cyan: 'bg-cyan-500/10 text-cyan-400',
    };

    const displayValue = typeof value === 'string' 
        ? value.charAt(0).toUpperCase() + value.slice(1).replace('_', ' ')
        : value ?? 'N/A';

    return (
        <div className={`p-3 rounded-lg ${colors[color]}`}>
            <div className="text-xs opacity-80 mb-1">{label}</div>
            <div className="text-lg font-bold">{displayValue}</div>
        </div>
    );
}
