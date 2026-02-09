import { motion } from 'framer-motion';
import { Crown, Target, Building2 } from 'lucide-react';
import type { Competitor } from '../../types';

interface ChromeTabsProps {
    competitors: Competitor[];
    selectedId: string | null;
    onSelect: (id: string) => void;
}

// Cores por grupo
const groupColors = {
    benchmark: {
        icon: Crown,
        color: '#06b6d4', // cyan
        bg: 'rgba(6, 182, 212, 0.15)',
        border: 'rgba(6, 182, 212, 0.3)',
    },
    diretos: {
        icon: Target,
        color: '#f59e0b', // amber
        bg: 'rgba(245, 158, 11, 0.15)',
        border: 'rgba(245, 158, 11, 0.3)',
    },
    institucionais: {
        icon: Building2,
        color: '#3b82f6', // blue
        bg: 'rgba(59, 130, 246, 0.15)',
        border: 'rgba(59, 130, 246, 0.3)',
    },
};

export function ChromeTabs({ competitors, selectedId, onSelect }: ChromeTabsProps) {
    if (competitors.length === 0) {
        return (
            <div className="flex items-center justify-center h-12 text-zinc-500 text-sm">
                Nenhum concorrente encontrado
            </div>
        );
    }

    // Ordenar: benchmark primeiro, depois por prioridade
    const sortedCompetitors = [...competitors].sort((a, b) => {
        const groupOrder = { benchmark: 0, diretos: 1, institucionais: 2 };
        const groupDiff = (groupOrder[a.grupo] || 3) - (groupOrder[b.grupo] || 3);
        if (groupDiff !== 0) return groupDiff;
        
        const priorityOrder = { alta: 0, media: 1, baixa: 2 };
        return (priorityOrder[a.prioridade] || 3) - (priorityOrder[b.prioridade] || 3);
    });

    return (
        <div className="chrome-tabs-container">
            <div className="chrome-tabs-scroll">
                {sortedCompetitors.map((comp, index) => {
                    const isSelected = selectedId === comp.id;
                    const groupStyle = groupColors[comp.grupo] || groupColors.institucionais;
                    const Icon = groupStyle.icon;
                    
                    return (
                        <motion.button
                            key={comp.id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            onClick={() => onSelect(comp.id)}
                            className={`
                                chrome-tab
                                ${isSelected ? 'chrome-tab--active' : ''}
                                ${comp.grupo === 'benchmark' ? 'chrome-tab--benchmark' : ''}
                            `}
                            style={{
                                '--tab-color': groupStyle.color,
                                '--tab-bg': isSelected ? groupStyle.bg : 'transparent',
                                '--tab-border': isSelected ? groupStyle.border : 'transparent',
                            } as React.CSSProperties}
                        >
                            {/* Ícone do grupo */}
                            <span 
                                className="chrome-tab-icon"
                                style={{ color: isSelected ? groupStyle.color : '#71717a' }}
                            >
                                <Icon className="w-3.5 h-3.5" />
                            </span>
                            
                            {/* Nome do concorrente - somente isso */}
                            <span className="chrome-tab-label" title={comp.nome}>
                                {comp.nome}
                            </span>
                            
                            {/* Linha ativa */}
                            {isSelected && (
                                <motion.div
                                    layoutId="activeTabLine"
                                    className="chrome-tab-active-line"
                                    style={{ backgroundColor: groupStyle.color }}
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}

// Versão compacta para mobile
export function ChromeTabsCompact({ competitors, selectedId, onSelect }: ChromeTabsProps) {
    const selectedCompetitor = competitors.find(c => c.id === selectedId);
    
    if (!selectedCompetitor) return null;

    const groupStyle = groupColors[selectedCompetitor.grupo] || groupColors.institucionais;
    const Icon = groupStyle.icon;

    return (
        <div className="chrome-tabs-compact">
            <select 
                value={selectedId || ''}
                onChange={(e) => onSelect(e.target.value)}
                className="chrome-tabs-select"
            >
                {competitors.map(comp => (
                    <option key={comp.id} value={comp.id}>
                        {comp.nome}
                    </option>
                ))}
            </select>
            <Icon className="w-4 h-4" style={{ color: groupStyle.color }} />
        </div>
    );
}
