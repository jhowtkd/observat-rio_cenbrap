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

interface AdsInvestmentChartProps {
    competitors: Competitor[];
    selectedCompetitor?: Competitor;
}

export function AdsInvestmentChart({ competitors, selectedCompetitor }: AdsInvestmentChartProps) {
    // Ordenar por número de anúncios
    const data = competitors
        .filter(c => (c.trafego_pago?.meta_ads?.anuncios_ativos || 0) > 0)
        .sort((a, b) => (b.trafego_pago?.meta_ads?.anuncios_ativos || 0) - (a.trafego_pago?.meta_ads?.anuncios_ativos || 0))
        .slice(0, 10) // Top 10
        .map(c => ({
            name: c.nome.length > 15 ? c.nome.slice(0, 15) + '...' : c.nome,
            fullName: c.nome,
            ads: c.trafego_pago?.meta_ads?.anuncios_ativos || 0,
            id: c.id,
            isSelected: c.id === selectedCompetitor?.id,
            investimento: c.trafego_pago?.meta_ads?.investimento_estimado || 'muito_baixo',
        }));

    const getColorByInvestment = (level?: string) => {
        const colors: Record<string, string> = {
            muito_baixo: '#71717a',
            baixo: '#3b82f6',
            medio: '#06b6d4',
            alto: '#f59e0b',
            muito_alto: '#ef4444',
        };
        return colors[level || 'muito_baixo'] || colors.muito_baixo;
    };

    return (
        <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                    data={data} 
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                    <XAxis 
                        type="number" 
                        tick={{ fill: '#71717a', fontSize: 11 }}
                        axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                    />
                    <YAxis 
                        type="category" 
                        dataKey="name"
                        tick={{ fill: '#a1a1aa', fontSize: 10 }}
                        axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                        width={100}
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
                            return [`${value} anúncios ativos no Meta Ads`, (props?.payload as {fullName: string})?.fullName];
                        }}
                    />
                    <Bar dataKey="ads" radius={[0, 4, 4, 0]}>
                        {data.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={entry.isSelected ? '#f59e0b' : getColorByInvestment(entry.investimento)}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
            
            {/* Legenda de investimento */}
            <div className="flex items-center justify-center gap-4 text-[10px] text-zinc-500 mt-2">
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-zinc-500" />
                    <span>Muito baixo</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Baixo</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-cyan-500" />
                    <span>Médio</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Alto</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span>Muito alto</span>
                </div>
            </div>
        </div>
    );
}
