import { AlertTriangle, Target, Shield, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import type { Competitor, Vulnerability } from '../../types';
import { SourceBadge } from '../shared/SourceBadge';

interface VulnerabilitiesTabProps {
    competitor: Competitor;
}

export function VulnerabilitiesTab({ competitor }: VulnerabilitiesTabProps) {
    const vulnerabilidades = competitor.vulnerabilidades || [];

    if (vulnerabilidades.length === 0) {
        return (
            <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-emerald-400" />
                </div>
                <div className="text-zinc-300 font-medium mb-1">Nenhuma vulnerabilidade crítica identificada</div>
                <div className="text-sm text-zinc-500">
                    Este concorrente não apresenta fraquezas significativas no momento.
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <span className="text-sm text-zinc-400">
                        {vulnerabilidades.length} fraqueza{vulnerabilidades.length > 1 ? 's' : ''} identificada{vulnerabilidades.length > 1 ? 's' : ''}
                    </span>
                </div>
                <SeverityLegend />
            </div>

            {vulnerabilidades.map((vuln, index) => (
                <VulnerabilityCard key={vuln.id || index} vulnerability={vuln} index={index + 1} />
            ))}
        </div>
    );
}

function VulnerabilityCard({ vulnerability, index }: { vulnerability: Vulnerability; index: number }) {
    const [expanded, setExpanded] = useState(false);

    const severityColors = {
        alta: {
            border: 'border-red-500/30',
            bg: 'bg-red-500/5',
            badge: 'bg-red-500/10 text-red-400 border-red-500/20',
            icon: 'text-red-400',
        },
        media: {
            border: 'border-amber-500/30',
            bg: 'bg-amber-500/5',
            badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
            icon: 'text-amber-400',
        },
        baixa: {
            border: 'border-blue-500/30',
            bg: 'bg-blue-500/5',
            badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            icon: 'text-blue-400',
        },
    };

    const colors = severityColors[vulnerability.gravidade];

    return (
        <div className={`rounded-xl border ${colors.border} ${colors.bg} overflow-hidden transition-all duration-200`}>
            {/* Header */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full p-4 flex items-start gap-3 text-left"
            >
                <div className={`w-8 h-8 rounded-lg ${colors.badge} flex items-center justify-center font-bold shrink-0`}>
                    {index}
                </div>
                
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${colors.badge}`}>
                            {vulnerability.gravidade}
                        </span>
                        <span className="text-xs text-zinc-500">{vulnerability.tipo}</span>
                    </div>
                    <h5 className="font-semibold text-zinc-200">{vulnerability.titulo}</h5>
                    <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{vulnerability.descricao}</p>
                </div>

                <div className="shrink-0">
                    {expanded ? (
                        <ChevronUp className="w-5 h-5 text-zinc-500" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-zinc-500" />
                    )}
                </div>
            </button>

            {/* Expanded Content */}
            {expanded && (
                <div className="px-4 pb-4 border-t border-white/[0.06]">
                    <div className="pt-4 space-y-4">
                        {/* Descrição completa */}
                        <div>
                            <h6 className="text-xs font-semibold text-zinc-500 mb-2">Descrição</h6>
                            <p className="text-sm text-zinc-300">{vulnerability.descricao}</p>
                        </div>

                        {/* Quem apresenta */}
                        {vulnerability.concorrentes_afetados && vulnerability.concorrentes_afetados.length > 0 && (
                            <div>
                                <h6 className="text-xs font-semibold text-zinc-500 mb-2 flex items-center gap-2">
                                    <Target className="w-3 h-3" />
                                    Concorrentes Afetados
                                </h6>
                                <div className="flex flex-wrap gap-1.5">
                                    {vulnerability.concorrentes_afetados.map((nome, i) => (
                                        <span 
                                            key={i}
                                            className="px-2 py-1 rounded text-xs bg-zinc-800 text-zinc-300 border border-white/[0.06]"
                                        >
                                            {nome}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Como atacar */}
                        <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                            <h6 className="text-xs font-semibold text-red-400 mb-2 flex items-center gap-2">
                                <AlertTriangle className="w-3 h-3" />
                                Como Aproveitar
                            </h6>
                            <p className="text-sm text-zinc-300">{vulnerability.como_atacar}</p>
                        </div>

                        {/* Diferencial Competitivo */}
                        <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                            <h6 className="text-xs font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                                <Shield className="w-3 h-3" />
                                Diferencial Competitivo
                            </h6>
                            <p className="text-sm text-zinc-300">{vulnerability.contra_ataque}</p>
                        </div>

                        {/* Evidências */}
                        {vulnerability.evidencias && vulnerability.evidencias.length > 0 && (
                            <div>
                                <h6 className="text-xs font-semibold text-zinc-500 mb-2">Evidências</h6>
                                <div className="grid grid-cols-2 gap-2">
                                    {vulnerability.evidencias.map((ev, i) => (
                                        <a
                                            key={i}
                                            href={ev.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-lg bg-zinc-800/50 border border-white/[0.06] hover:border-white/[0.1] transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">
                                                    {ev.tipo === 'screenshot' ? '📷' : ev.tipo === 'video' ? '🎥' : '📄'}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-xs text-zinc-300 truncate">{ev.descricao}</div>
                                                    <div className="text-[10px] text-zinc-500">{ev.data_coleta}</div>
                                                </div>
                                                <ExternalLink className="w-3 h-3 text-zinc-600" />
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Fonte */}
                        {vulnerability.fonte_analise && (
                            <div className="pt-2">
                                <SourceBadge source={vulnerability.fonte_analise} compact />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function SeverityLegend() {
    return (
        <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <span className="text-zinc-500">Alta</span>
            </div>
            <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-zinc-500">Média</span>
            </div>
            <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <span className="text-zinc-500">Baixa</span>
            </div>
        </div>
    );
}
