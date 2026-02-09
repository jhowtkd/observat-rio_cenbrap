import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import type { Competitor } from '../../types';
import { getPriceRange, getPriceRangeConfig, PRICE_RANGES } from '../../utils/priceUtils';

interface PriceDistributionProps {
    competitors: Competitor[];
    selectedCompetitor?: Competitor;
}

export function PriceDistribution({ competitors, selectedCompetitor }: PriceDistributionProps) {
    // Usar as faixas definidas no priceUtils
    const priceRanges = [
        { label: '$', range: '$', description: 'Até R$ 4.000', min: 0, max: 4000, color: '#10b981' },
        { label: '$$', range: '$$', description: 'R$ 4.000 - 7.000', min: 4000, max: 7000, color: '#f59e0b' },
        { label: '$$$', range: '$$$', description: 'Acima R$ 7.000', min: 7000, max: Infinity, color: '#ef4444' },
        { label: '?', range: '?', description: 'Não divulgado', min: -1, max: 0, color: '#71717a' },
    ];

    // Contar concorrentes por faixa
    const data = priceRanges.map(range => {
        let count: number;
        
        if (range.range === '?') {
            // Contar concorrentes sem preço informado
            count = competitors.filter(c => {
                const price = c.oferta?.valor_total;
                return !price || price === 0;
            }).length;
        } else {
            count = competitors.filter(c => {
                const price = c.oferta?.valor_total;
                if (!price || price === 0) return false;
                return price > range.min && price <= range.max;
            }).length;
        }

        const isSelected = selectedCompetitor?.oferta?.valor_total 
            ? getPriceRange(selectedCompetitor.oferta.valor_total) === range.range
            : false;

        return {
            name: range.label,
            fullLabel: range.description,
            count,
            color: range.color,
            isSelected,
        };
    });

    // Calcular média apenas para preços válidos
    const validPrices = competitors
        .map(c => c.oferta?.valor_total)
        .filter((p): p is number => p !== undefined && p > 0);
    
    const averagePrice = validPrices.length > 0 
        ? validPrices.reduce((a, b) => a + b, 0) / validPrices.length 
        : 0;
    
    // Faixa da média para referência
    getPriceRange(averagePrice);

    return (
        <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis 
                        dataKey="name" 
                        tick={{ fill: '#a1a1aa', fontSize: 14, fontWeight: 'bold' }}
                        axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                    />
                    <YAxis 
                        tick={{ fill: '#71717a', fontSize: 11 }}
                        axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                        allowDecimals={false}
                    />
                    <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{
                            backgroundColor: '#141414',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: '#fff',
                        }}
                        formatter={(value, _name, props) => {
                            const item = props.payload;
                            return [`${value} concorrentes`, `${item.name} - ${item.fullLabel}`];
                        }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={entry.isSelected ? '#f59e0b' : entry.color}
                                fillOpacity={entry.isSelected ? 1 : 0.8}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
            
            {/* Legenda */}
            <div className="mt-4 flex items-center justify-center gap-6 text-xs flex-wrap">
                {PRICE_RANGES.map(range => (
                    <div key={range.range} className="flex items-center gap-2">
                        <div 
                            className="w-3 h-3 rounded" 
                            style={{ backgroundColor: range.color }}
                        />
                        <span className="text-zinc-400">
                            <span className="font-bold" style={{ color: range.color }}>
                                {range.range}
                            </span>
                            {' '}{range.label}
                        </span>
                    </div>
                ))}
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-zinc-500" />
                    <span className="text-zinc-400">? Não divulgado</span>
                </div>
            </div>
            
            {/* Preço selecionado */}
            {selectedCompetitor?.oferta?.valor_total ? (
                <div className="mt-3 flex items-center justify-center gap-2 text-sm">
                    <div 
                        className="w-3 h-3 rounded" 
                        style={{ backgroundColor: getPriceRangeConfig(selectedCompetitor.oferta.valor_total)?.color || '#f59e0b' }}
                    />
                    <span className="text-zinc-400">
                        {selectedCompetitor.nome}: 
                        <span 
                            className="font-semibold ml-1"
                            style={{ color: getPriceRangeConfig(selectedCompetitor.oferta.valor_total)?.color || '#f59e0b' }}
                        >
                            {getPriceRange(selectedCompetitor.oferta.valor_total)}
                        </span>
                        <span className="text-zinc-600 text-xs ml-1">
                            ({getPriceRangeConfig(selectedCompetitor.oferta.valor_total)?.description})
                        </span>
                    </span>
                </div>
            ) : selectedCompetitor && (
                <div className="mt-3 flex items-center justify-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded bg-zinc-500" />
                    <span className="text-zinc-400">
                        {selectedCompetitor.nome}: 
                        <span className="text-zinc-500 font-semibold ml-1">?</span>
                        <span className="text-zinc-600 text-xs ml-1">(Preço não divulgado)</span>
                    </span>
                </div>
            )}
        </div>
    );
}
