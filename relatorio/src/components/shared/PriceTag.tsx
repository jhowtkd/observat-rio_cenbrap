import { TrendingUp, TrendingDown, Minus, DollarSign } from 'lucide-react';
import type { PrecoComContexto } from '../../types';
import { SourceBadge } from './SourceBadge';
import { getPriceRange, getPriceRangeConfig, getPriceRangeColor } from '../../utils/priceUtils';

interface PriceTagProps {
    preco: PrecoComContexto;
    showContext?: boolean;
    showSource?: boolean;
}

export function PriceTag({ preco, showContext = true, showSource = true }: PriceTagProps) {
    const formatCurrency = (value?: number) => {
        if (!value) return 'N/A';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const getPeriodLabel = (periodo: string) => {
        const labels: Record<string, string> = {
            total_curso: 'total do curso',
            mensal: 'mensal',
            semestral: 'por semestre',
            por_modulo: 'por módulo',
        };
        return labels[periodo] || periodo;
    };

    const priceRange = getPriceRange(preco.valor_total);
    const priceConfig = getPriceRangeConfig(preco.valor_total);
    const priceColor = getPriceRangeColor(preco.valor_total);

    return (
        <div className="space-y-3">
            {/* Preço Principal - Agora com símbolos $, $$, $$$ */}
            <div className="flex items-baseline gap-3">
                {priceRange === '?' ? (
                    <span className="text-2xl font-bold text-zinc-500">
                        Preço sob consulta
                    </span>
                ) : (
                    <>
                        <span 
                            className="text-3xl font-bold"
                            style={{ color: priceColor }}
                            title={priceConfig?.description}
                        >
                            {priceRange}
                        </span>
                        <span className="text-sm text-zinc-400">
                            {priceConfig?.label}
                            <span className="text-zinc-600 ml-1">({priceConfig?.description})</span>
                        </span>
                    </>
                )}
            </div>

            {/* Preço numérico (menor, secundário) */}
            {preco.valor_total && (
                <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-zinc-600" />
                    <span className="text-zinc-500 line-through text-xs">
                        {formatCurrency(preco.valor_total)}
                    </span>
                    <span className="text-zinc-600 text-xs">
                        ({getPeriodLabel(preco.periodo_cobrado)})
                    </span>
                </div>
            )}

            {/* Preço Detalhado */}
            {showContext && (
                <div className="grid grid-cols-2 gap-2 text-sm">
                    {preco.valor_mensal && (
                        <div className="px-3 py-2 rounded-lg bg-zinc-900/50 border border-white/[0.06]">
                            <div className="text-xs text-zinc-500">Mensal</div>
                            <div className="font-medium text-zinc-300">
                                {formatCurrency(preco.valor_mensal)}
                            </div>
                        </div>
                    )}
                    
                    {preco.valor_semestre && (
                        <div className="px-3 py-2 rounded-lg bg-zinc-900/50 border border-white/[0.06]">
                            <div className="text-xs text-zinc-500">Semestral</div>
                            <div className="font-medium text-zinc-300">
                                {formatCurrency(preco.valor_semestre)}
                            </div>
                        </div>
                    )}

                    {preco.preco_avista && (
                        <div className="px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <div className="text-xs text-emerald-400">À Vista</div>
                            <div className="font-medium text-emerald-300">
                                {preco.preco_avista}
                            </div>
                            {preco.desconto_a_vista && (
                                <div className="text-[10px] text-emerald-500">
                                    {preco.desconto_a_vista} OFF
                                </div>
                            )}
                        </div>
                    )}

                    {preco.parcelamento_max && (
                        <div className="px-3 py-2 rounded-lg bg-zinc-900/50 border border-white/[0.06]">
                            <div className="text-xs text-zinc-500">Parcelamento</div>
                            <div className="font-medium text-zinc-300">
                                até {preco.parcelamento_max}x
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Inclusões */}
            {showContext && (
                <div className="flex flex-wrap gap-2">
                    <InclusionBadge 
                        active={preco.inclui_material} 
                        label="Material" 
                    />
                    <InclusionBadge 
                        active={preco.inclui_certificado} 
                        label="Certificado" 
                    />
                    {preco.taxa_matricula && (
                        <span className="text-xs px-2 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            + Taxa matrícula: {formatCurrency(preco.taxa_matricula)}
                        </span>
                    )}
                </div>
            )}

            {/* Duração */}
            {showContext && preco.duracao_meses && (
                <div className="text-sm text-zinc-400">
                    Duração: <span className="text-zinc-300">{preco.duracao_meses} meses</span>
                </div>
            )}

            {/* Fonte */}
            {showSource && <SourceBadge source={preco.fonte} compact />}
        </div>
    );
}

function InclusionBadge({ active, label }: { active: boolean; label: string }) {
    return (
        <span className={`
            text-xs px-2 py-1 rounded border
            ${active 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : 'bg-zinc-800 text-zinc-500 border-zinc-700'
            }
        `}>
            {active ? '✓' : '✗'} {label}
        </span>
    );
}

// Comparador de preços - atualizado para usar faixas
interface PriceComparisonProps {
    preco: number;
    mediaMercado: number;
}

export function PriceComparison({ preco, mediaMercado }: PriceComparisonProps) {
    const diff = ((preco - mediaMercado) / mediaMercado) * 100;
    const isAbove = diff > 0;
    const isEqual = Math.abs(diff) < 1;

    // Obter faixas de preço
    const precoRange = getPriceRange(preco);
    const mediaRange = getPriceRange(mediaMercado);

    if (isEqual) {
        return (
            <div className="flex items-center gap-1.5 text-zinc-400">
                <Minus className="w-4 h-4" />
                <span className="text-sm">Na média do mercado</span>
            </div>
        );
    }

    return (
        <div className={`flex items-center gap-1.5 ${isAbove ? 'text-red-400' : 'text-emerald-400'}`}>
            {isAbove ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="text-sm font-medium">
                {Math.abs(diff).toFixed(0)}% {isAbove ? 'acima' : 'abaixo'} da média
            </span>
            <span className="text-xs text-zinc-500 ml-2">
                ({precoRange} vs {mediaRange})
            </span>
        </div>
    );
}

// Badge de faixa de preço para uso em listas e cards
interface PriceRangeBadgeProps {
    value?: number | null;
    size?: 'sm' | 'md' | 'lg';
}

export function PriceRangeBadge({ value, size = 'md' }: PriceRangeBadgeProps) {
    const range = getPriceRange(value);
    const config = getPriceRangeConfig(value);
    const color = config?.color || '#71717a';
    
    const sizeClasses = {
        sm: 'text-xs px-2 py-0.5 gap-1',
        md: 'text-sm px-3 py-1 gap-2',
        lg: 'text-lg px-4 py-2 gap-2',
    };

    if (range === '?') {
        return (
            <span 
                className={`inline-flex items-center rounded-full border border-zinc-700 bg-zinc-800 text-zinc-400 font-medium ${sizeClasses[size]}`}
                title="Preço não divulgado no site"
            >
                <span>?</span>
                <span className="text-xs opacity-70">sob consulta</span>
            </span>
        );
    }

    return (
        <span 
            className={`inline-flex items-center rounded-full border font-bold ${sizeClasses[size]}`}
            style={{ 
                backgroundColor: `${color}15`,
                borderColor: `${color}30`,
                color: color
            }}
            title={config?.description}
        >
            <span className="tracking-wider">{range}</span>
            {size !== 'sm' && <span className="text-xs opacity-70 font-normal">{config?.label}</span>}
        </span>
    );
}
