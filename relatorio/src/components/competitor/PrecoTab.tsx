import { DollarSign, Package, CreditCard, Gift, Percent, Info } from 'lucide-react';
import type { Competitor } from '../../types';
import { PriceTag, PriceComparison, PriceRangeBadge } from '../shared/PriceTag';
import { SourceBadge } from '../shared/SourceBadge';
import { getPriceRangeLabel, getPriceRangeColor } from '../../utils/priceUtils';

interface PrecoTabProps {
    competitor: Competitor;
    mediaMercado?: number;
}

export function PrecoTab({ competitor, mediaMercado }: PrecoTabProps) {
    const o = competitor.oferta;
    const lp = competitor.landing_page;

    if (!o) {
        return (
            <div className="p-8 text-center">
                <div className="text-zinc-500">Dados de preço não disponíveis</div>
                <SourceBadge 
                    source={{ tipo: 'analise', data_coleta: competitor.ultima_atualizacao, observacao: 'Preço não informado no site' }} 
                />
            </div>
        );
    }

    const priceColor = getPriceRangeColor(o.valor_total);
    const priceLabel = getPriceRangeLabel(o.valor_total);

    return (
        <div className="space-y-6">
            {/* Preço Principal - Destaque com símbolos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl bg-gradient-to-br from-zinc-900/50 to-zinc-900/30 border border-white/[0.06]">
                    <h4 className="text-sm font-semibold text-zinc-400 mb-4 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" style={{ color: priceColor }} />
                        Faixa de Preço
                    </h4>
                    
                    {/* Badge grande da faixa de preço */}
                    <div className="flex items-center gap-4 mb-4">
                        <PriceRangeBadge value={o.valor_total} size="lg" />
                    </div>
                    
                    <p className="text-sm text-zinc-500">
                        {o.valor_total 
                            ? `Este concorrente está na categoria ${priceLabel.toLowerCase()} de preço do mercado.`
                            : 'Preço não divulgado no site.'
                        }
                    </p>
                    
                    {o.observacao_preco && (
                        <div className="mt-4 flex items-start gap-2 text-xs text-amber-400 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            {o.observacao_preco}
                        </div>
                    )}
                </div>

                {/* Comparação com média */}
                {mediaMercado && o.valor_total && (
                    <div className="p-6 rounded-xl bg-zinc-900/30 border border-white/[0.06]">
                        <h4 className="text-sm font-semibold text-zinc-400 mb-4 flex items-center gap-2">
                            <Percent className="w-4 h-4 text-cyan-400" />
                            Comparativo de Mercado
                        </h4>
                        <PriceComparison preco={o.valor_total} mediaMercado={mediaMercado} />
                        
                        <div className="mt-4 p-3 rounded-lg bg-zinc-800/50">
                            <div className="text-xs text-zinc-500 mb-2">Média do mercado</div>
                            <div className="flex items-center gap-2">
                                <PriceRangeBadge value={mediaMercado} size="sm" />
                                <span className="text-xs text-zinc-600 line-through">
                                    {new Intl.NumberFormat('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                        minimumFractionDigits: 0,
                                    }).format(mediaMercado)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Estrutura de Preço Detalhada */}
            <div className="p-6 rounded-xl bg-zinc-900/30 border border-white/[0.06]">
                <h4 className="text-sm font-semibold text-zinc-400 mb-4 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    Estrutura de Preço
                </h4>
                <PriceTag preco={o} showContext />
            </div>

            {/* Condições e Bônus */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl bg-zinc-900/30 border border-white/[0.06]">
                    <h4 className="text-sm font-semibold text-zinc-400 mb-4 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-amber-400" />
                        Condições de Pagamento
                    </h4>
                    
                    <div className="space-y-3">
                        {o.garantia && (
                            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30">
                                <span className="text-sm text-zinc-400">Garantia</span>
                                <span className="text-sm font-medium text-emerald-400">{o.garantia}</span>
                            </div>
                        )}
                        
                        {o.parcelamento_max && (
                            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30">
                                <span className="text-sm text-zinc-400">Parcelamento máximo</span>
                                <span className="text-sm font-medium text-zinc-300">
                                    {o.parcelamento_max}x
                                </span>
                            </div>
                        )}
                        
                        <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30">
                            <span className="text-sm text-zinc-400">Transparência de preço</span>
                            <span className={`text-sm font-medium ${o.preco_transparente ? 'text-emerald-400' : 'text-red-400'}`}>
                                {o.preco_transparente ? 'Preço aberto' : 'Preço oculto'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Bônus */}
                <div className="p-5 rounded-xl bg-zinc-900/30 border border-white/[0.06]">
                    <h4 className="text-sm font-semibold text-zinc-400 mb-4 flex items-center gap-2">
                        <Gift className="w-4 h-4 text-purple-400" />
                        Bônus Inclusos
                    </h4>
                    
                    {o.bonus_inclusos && o.bonus_inclusos.length > 0 ? (
                        <ul className="space-y-2">
                            {o.bonus_inclusos.map((bonus, i) => (
                                <li 
                                    key={i} 
                                    className="flex items-center gap-2 text-sm text-zinc-300 p-2 rounded-lg bg-zinc-800/30"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                                    {bonus}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-sm text-zinc-500 italic">
                            Nenhum bônus informado
                        </div>
                    )}
                </div>
            </div>

            {/* Landing Page CRO */}
            {lp && (
                <div className="p-5 rounded-xl bg-zinc-900/30 border border-white/[0.06]">
                    <h4 className="text-sm font-semibold text-zinc-400 mb-4 flex items-center gap-2">
                        <Package className="w-4 h-4 text-pink-400" />
                        Landing Page (CRO)
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <InfoBlock label="Headline" value={lp.headline} />
                        <InfoBlock 
                            label="Vídeo de Vendas" 
                            value={lp.video_vendas?.tem ? `Sim (${lp.video_vendas.duracao})` : 'Não'} 
                        />
                        <InfoBlock label="Prova Social" value={lp.prova_social?.tipo} />
                        <InfoBlock label="Escassez" value={lp.escassez} />
                        <InfoBlock label="Urgência" value={lp.urgencia} />
                        <InfoBlock 
                            label="Campos do Formulário" 
                            value={lp.formulario?.campos.join(', ')} 
                        />
                    </div>

                    {lp.fonte && (
                        <div className="mt-4 pt-4 border-t border-white/[0.06]">
                            <SourceBadge source={lp.fonte} compact />
                        </div>
                    )}
                </div>
            )}

            {/* Fonte e Observação */}
            <div className="p-4 rounded-xl bg-zinc-900/30 border border-white/[0.06]">
                <h4 className="text-sm font-semibold text-zinc-400 mb-3">Fonte dos Dados</h4>
                <div className="space-y-2">
                    {o.fonte && (
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-zinc-500">Origem do preço:</span>
                            <span className="text-xs text-zinc-300">{o.fonte.tipo === 'site' ? 'Website oficial' : o.fonte.tipo}</span>
                        </div>
                    )}
                    {o.fonte?.url && (
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-zinc-500">URL:</span>
                            <a 
                                href={o.fonte.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-cyan-400 hover:underline truncate max-w-xs"
                            >
                                {o.fonte.url}
                            </a>
                        </div>
                    )}
                    {o.fonte?.data_coleta && (
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-zinc-500">Data da coleta:</span>
                            <span className="text-xs text-zinc-300">
                                {new Date(o.fonte.data_coleta).toLocaleDateString('pt-BR')}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function InfoBlock({ label, value }: { label: string; value?: string }) {
    if (!value) return null;
    
    return (
        <div className="p-3 rounded-lg bg-zinc-800/30">
            <div className="text-xs text-zinc-500 mb-1">{label}</div>
            <div className="text-sm text-zinc-300">{value}</div>
        </div>
    );
}
