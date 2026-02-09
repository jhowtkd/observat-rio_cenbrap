import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ZAxis,
    ReferenceLine,
} from 'recharts';
import type { Competitor } from '../../types';

interface PositioningMatrixProps {
    competitors: Competitor[];
    selectedCompetitor?: Competitor;
}

export function PositioningMatrix({ competitors, selectedCompetitor }: PositioningMatrixProps) {
    // Calcular credibilidade baseada em múltiplos fatores
    const calcCredibility = (c: Competitor): number => {
        let score = 5; // Base
        
        // MEC credenciada = +3
        if (c.ficha_cadastral?.credenciamento_mec?.includes('Credenciada')) score += 3;
        
        // Corpo docente público = +1
        if (c.autoridade?.corpo_docente_publico) score += 1;
        
        // Anos de fundação
        const ano = c.ficha_cadastral?.ano_fundacao;
        if (ano) {
            const idade = 2026 - ano;
            if (idade > 30) score += 2;
            else if (idade > 10) score += 1;
        }
        
        // Alunos formados
        const alunos = c.ficha_cadastral?.alunos_formados;
        if (alunos?.includes('10000')) score += 2;
        else if (alunos?.includes('1000')) score += 1;
        
        // Prova social
        if (c.autoridade?.casos_sucesso) score += 1;
        
        return Math.min(score, 10);
    };

    // Preparar dados
    const data = competitors
        .filter(c => c.oferta?.valor_total)
        .map(c => ({
            x: (c.oferta?.valor_total || 0) / 1000, // Preço em milhares
            y: calcCredibility(c),
            z: c.trafego_pago?.meta_ads?.anuncios_ativos || 1, // Tamanho do bubble = ads
            name: c.nome,
            id: c.id,
            isSelected: c.id === selectedCompetitor?.id,
        }));

    // Calcular médias
    const avgPrice = data.reduce((sum, d) => sum + d.x, 0) / data.length;
    const avgCred = data.reduce((sum, d) => sum + d.y, 0) / data.length;

    // Custom tooltip
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-[#141414] border border-white/10 rounded-lg p-3 shadow-xl">
                    <p className="font-semibold text-white mb-1">{data.name}</p>
                    <p className="text-sm text-zinc-400">
                        Preço: <span className="text-cyan-400">R$ {data.x}k</span>
                    </p>
                    <p className="text-sm text-zinc-400">
                        Credibilidade: <span className="text-amber-400">{data.y}/10</span>
                    </p>
                    <p className="text-sm text-zinc-400">
                        Anúncios ativos: <span className="text-purple-400">{data.z}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis 
                        type="number" 
                        dataKey="x" 
                        name="Preço" 
                        unit="k"
                        tick={{ fill: '#a1a1aa', fontSize: 11 }}
                        axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                        label={{ value: 'Preço (R$ mil)', position: 'bottom', fill: '#71717a', fontSize: 11 }}
                    />
                    <YAxis 
                        type="number" 
                        dataKey="y" 
                        name="Credibilidade" 
                        domain={[0, 10]}
                        tick={{ fill: '#a1a1aa', fontSize: 11 }}
                        axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                        label={{ value: 'Credibilidade', angle: -90, position: 'insideLeft', fill: '#71717a', fontSize: 11 }}
                    />
                    <ZAxis type="number" dataKey="z" range={[50, 400]} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeDasharray: '3 3' }} />
                    
                    {/* Linhas de referência (médias) */}
                    <ReferenceLine x={avgPrice} stroke="#f59e0b" strokeDasharray="5 5" />
                    <ReferenceLine y={avgCred} stroke="#f59e0b" strokeDasharray="5 5" />
                    
                    <Scatter name="Concorrentes" data={data} fill="#06b6d4" />
                </ScatterChart>
            </ResponsiveContainer>
            
            {/* Legenda */}
            <div className="flex items-center justify-center gap-6 text-xs text-zinc-500 mt-2">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-cyan-500" />
                    <span>Concorrente</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <span>Selecionado</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-0 border-t border-dashed border-amber-500" />
                    <span>Média do mercado</span>
                </div>
            </div>
        </div>
    );
}
