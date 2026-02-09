import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from 'recharts';
import type { Competitor } from '../../types';

interface RadarComparisonProps {
    competitors: Competitor[];
    selectedCompetitor?: Competitor;
}

export function RadarComparison({ competitors, selectedCompetitor }: RadarComparisonProps) {
    // Encontrar CENBRAP nos competitors
    const cenbrap = competitors.find(c => c.id === 'cenbrap');
    
    // Calcular médias para benchmark
    const calcScore = (c: Competitor) => {
        const hasMEC = c.ficha_cadastral?.credenciamento_mec?.includes('Credenciada') ? 10 : 0;
        const hasDocente = c.autoridade?.corpo_docente_publico ? 10 : 3;
        const hasPreco = c.oferta?.preco_transparente ? 10 : 5;
        const adsScore = Math.min((c.trafego_pago?.meta_ads?.anuncios_ativos || 0) * 0.5, 10);
        const socialScore = c.digital?.instagram?.seguidores 
            ? Math.min(parseFloat(c.digital.instagram.seguidores) / 10000, 10) 
            : 2;
        
        return {
            mec: hasMEC,
            docente: hasDocente,
            preco: hasPreco,
            ads: adsScore,
            social: socialScore,
        };
    };

    // Criar dados para o radar
    const data = [
        { subject: 'Credenciamento', key: 'mec', fullMark: 10 },
        { subject: 'Corpo Docente', key: 'docente', fullMark: 10 },
        { subject: 'Preço Transparente', key: 'preco', fullMark: 10 },
        { subject: 'Invest. Ads', key: 'ads', fullMark: 10 },
        { subject: 'Presença Social', key: 'social', fullMark: 10 },
    ];

    // Adicionar dados dos concorrentes
    const chartData = data.map(d => {
        const point: Record<string, number | string> = {
            subject: d.subject,
            fullMark: d.fullMark,
        };

        // Média do grupo (excluindo CENBRAP para não distorcer)
        const outrosConcorrentes = competitors.filter(c => c.id !== 'cenbrap');
        const scores = outrosConcorrentes.map(c => calcScore(c));
        const avgScore = scores.reduce((sum, s) => sum + s[d.key as keyof typeof s], 0) / scores.length;
        point['Média do Grupo'] = Math.round(avgScore);

        // CENBRAP sempre visível como benchmark
        if (cenbrap) {
            const cenbrapScore = calcScore(cenbrap);
            point['CENBRAP'] = cenbrapScore[d.key as keyof typeof cenbrapScore];
        }

        // Concorrente selecionado
        if (selectedCompetitor && selectedCompetitor.id !== 'cenbrap') {
            const selectedScore = calcScore(selectedCompetitor);
            point[selectedCompetitor.nome] = selectedScore[d.key as keyof typeof selectedScore];
        }

        return point;
    });

    const colors = ['#06b6d4', '#f59e0b', '#10b981'];

    return (
        <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis 
                        dataKey="subject" 
                        tick={{ fill: '#a1a1aa', fontSize: 11 }}
                    />
                    <PolarRadiusAxis 
                        angle={90} 
                        domain={[0, 10]} 
                        tick={{ fill: '#71717a', fontSize: 10 }}
                        tickCount={6}
                        stroke="rgba(255,255,255,0.05)"
                    />
                    <Radar
                        name="Média do Grupo"
                        dataKey="Média do Grupo"
                        stroke={colors[0]}
                        fill={colors[0]}
                        fillOpacity={0.1}
                        strokeWidth={2}
                    />
                    {cenbrap && (
                        <Radar
                            name="CENBRAP"
                            dataKey="CENBRAP"
                            stroke={colors[2]}
                            fill={colors[2]}
                            fillOpacity={0.15}
                            strokeWidth={2}
                        />
                    )}
                    {selectedCompetitor && selectedCompetitor.id !== 'cenbrap' && (
                        <Radar
                            name={selectedCompetitor.nome}
                            dataKey={selectedCompetitor.nome}
                            stroke={colors[1]}
                            fill={colors[1]}
                            fillOpacity={0.2}
                            strokeWidth={2}
                        />
                    )}
                    <Legend 
                        wrapperStyle={{ paddingTop: '20px' }}
                        iconType="circle"
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#141414',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: '#fff',
                        }}
                        itemStyle={{ color: '#fff' }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}
