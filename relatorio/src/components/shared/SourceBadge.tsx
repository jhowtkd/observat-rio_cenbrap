import { Globe, ExternalLink, Camera, FileText, BarChart3 } from 'lucide-react';
import type { Source } from '../../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SourceBadgeProps {
    source: Source;
    showDate?: boolean;
    compact?: boolean;
}

export function SourceBadge({ source, showDate = true, compact = false }: SourceBadgeProps) {
    const icons = {
        site: <Globe className="w-3 h-3" />,
        meta_ads: <BarChart3 className="w-3 h-3" />,
        google_ads: <BarChart3 className="w-3 h-3" />,
        instagram: <ExternalLink className="w-3 h-3" />,
        linkedin: <ExternalLink className="w-3 h-3" />,
        analise: <FileText className="w-3 h-3" />,
        print: <Camera className="w-3 h-3" />,
    };

    const labels = {
        site: 'Site',
        meta_ads: 'Meta Ads',
        google_ads: 'Google Ads',
        instagram: 'Instagram',
        linkedin: 'LinkedIn',
        analise: 'Análise',
        print: 'Print',
    };

    const formatDate = (dateStr: string) => {
        try {
            return format(new Date(dateStr), 'dd/MM/yy', { locale: ptBR });
        } catch {
            return dateStr;
        }
    };

    if (compact) {
        return (
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-400 border border-white/[0.06]">
                {icons[source.tipo]}
                <span>{labels[source.tipo]}</span>
                {showDate && <span className="text-zinc-500">• {formatDate(source.data_coleta)}</span>}
            </div>
        );
    }

    return (
        <div className="flex items-start gap-2 p-2 rounded-lg bg-zinc-900/50 border border-white/[0.06]">
            <div className="w-6 h-6 rounded-md bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
                {icons[source.tipo]}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-zinc-300">
                        {labels[source.tipo]}
                    </span>
                    {showDate && (
                        <span className="text-[10px] text-zinc-500">
                            {formatDate(source.data_coleta)}
                        </span>
                    )}
                </div>
                {source.url && (
                    <a 
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-cyan-400 hover:text-cyan-300 truncate block"
                    >
                        {source.url}
                    </a>
                )}
                {source.observacao && (
                    <p className="text-[10px] text-zinc-500 mt-1">
                        {source.observacao}
                    </p>
                )}
            </div>
        </div>
    );
}

// Componente para mostrar múltiplas fontes
interface SourcesListProps {
    sources: Source[];
    title?: string;
}

export function SourcesList({ sources, title = "Fontes" }: SourcesListProps) {
    if (!sources || sources.length === 0) return null;

    return (
        <div className="mt-4 pt-4 border-t border-white/[0.06]">
            <h5 className="text-xs font-medium text-zinc-500 mb-2 flex items-center gap-2">
                <FileText className="w-3 h-3" />
                {title}
            </h5>
            <div className="space-y-2">
                {sources.map((source, idx) => (
                    <SourceBadge key={idx} source={source} />
                ))}
            </div>
        </div>
    );
}
