import { Building2, Calendar, Users, MapPin, Award, GraduationCap, Shield, BookOpen, Globe } from 'lucide-react';
import type { Competitor } from '../../types';
import { SourceBadge } from '../shared/SourceBadge';
import { SocialLinksBlock } from '../shared/SocialLinks';

interface FichaTabProps {
    competitor: Competitor;
}

export function FichaTab({ competitor }: FichaTabProps) {
    const f = competitor.ficha_cadastral;
    const a = competitor.autoridade;

    return (
        <div className="space-y-6">
            {/* Links Sociais */}
            {competitor.digital && (
                <section>
                    <h4 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-cyan-400" />
                        Links Oficiais
                    </h4>
                    <SocialLinksBlock social={competitor.digital} />
                </section>
            )}

            {/* Grid de Informações */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Institucional */}
                <InfoCard 
                    title="Institucional"
                    icon={<Building2 className="w-4 h-4" />}
                    color="cyan"
                >
                    <InfoRow 
                        icon={<Building2 className="w-3.5 h-3.5" />}
                        label="Nome Completo"
                        value={f?.nome_completo}
                    />
                    <InfoRow 
                        icon={<Shield className="w-3.5 h-3.5" />}
                        label="Natureza Jurídica"
                        value={f?.natureza_juridica}
                    />
                    <InfoRow 
                        icon={<Award className="w-3.5 h-3.5" />}
                        label="Credenciamento MEC"
                        value={f?.credenciamento_mec}
                        highlight={f?.credenciamento_mec?.includes('Credenciada') ? 'positive' : 'warning'}
                    />
                    <InfoRow 
                        icon={<Calendar className="w-3.5 h-3.5" />}
                        label="Ano de Fundação"
                        value={f?.ano_fundacao?.toString()}
                    />
                    <InfoRow 
                        icon={<MapPin className="w-3.5 h-3.5" />}
                        label="Sede"
                        value={f?.sede}
                    />
                    
                    {f?.fonte_dados && (
                        <div className="mt-4 pt-4 border-t border-white/[0.06]">
                            <SourceBadge source={f.fonte_dados} compact />
                        </div>
                    )}
                </InfoCard>

                {/* Operacional */}
                <InfoCard 
                    title="Operacional"
                    icon={<BookOpen className="w-4 h-4" />}
                    color="indigo"
                >
                    <InfoRow 
                        icon={<GraduationCap className="w-3.5 h-3.5" />}
                        label="Modalidades"
                        value={f?.modalidade?.join(', ')}
                    />
                    <InfoRow 
                        icon={<Users className="w-3.5 h-3.5" />}
                        label="Alunos Formados"
                        value={f?.alunos_formados}
                    />
                    
                    {f?.especialidades && f.especialidades.length > 0 && (
                        <div className="mt-3">
                            <div className="text-xs text-zinc-500 mb-2">Especialidades</div>
                            <div className="flex flex-wrap gap-1.5">
                                {f.especialidades.map((esp, i) => (
                                    <span 
                                        key={i} 
                                        className="text-xs px-2 py-1 rounded-md bg-zinc-800 text-zinc-300 border border-white/[0.06]"
                                    >
                                        {esp}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </InfoCard>

                {/* Autoridade */}
                <InfoCard 
                    title="Autoridade"
                    icon={<Award className="w-4 h-4" />}
                    color="amber"
                >
                    <InfoRow 
                        icon={<Users className="w-3.5 h-3.5" />}
                        label="Corpo Docente Público"
                        value={a?.corpo_docente_publico ? 'Sim' : 'Não'}
                        highlight={a?.corpo_docente_publico ? 'positive' : 'negative'}
                    />
                    
                    {a?.professores_destacados && a.professores_destacados.length > 0 && (
                        <div className="mt-3">
                            <div className="text-xs text-zinc-500 mb-2">Professores Destacados</div>
                            <ul className="space-y-1">
                                {a.professores_destacados.map((prof, i) => (
                                    <li key={i} className="text-sm text-zinc-300 flex items-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-amber-400" />
                                        {prof}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    {a?.parcerias && a.parcerias.length > 0 && (
                        <div className="mt-3">
                            <div className="text-xs text-zinc-500 mb-2">Parcerias</div>
                            <div className="flex flex-wrap gap-1.5">
                                {a.parcerias.map((parceria, i) => (
                                    <span 
                                        key={i} 
                                        className="text-xs px-2 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                    >
                                        {parceria}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {a?.fonte && (
                        <div className="mt-4 pt-4 border-t border-white/[0.06]">
                            <SourceBadge source={a.fonte} compact />
                        </div>
                    )}
                </InfoCard>
            </div>

            {/* Fontes Principais */}
            {competitor.fontes && (
                <section className="p-4 rounded-xl bg-zinc-900/30 border border-white/[0.06]">
                    <h4 className="text-sm font-semibold text-zinc-400 mb-3">Fontes de Coleta</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {competitor.fontes.site_data_coleta && (
                            <div className="text-xs text-zinc-500">
                                <span className="text-zinc-400">Site:</span> {competitor.fontes.site_data_coleta}
                            </div>
                        )}
                        {competitor.fontes.meta_ads_data_coleta && (
                            <div className="text-xs text-zinc-500">
                                <span className="text-zinc-400">Meta Ads:</span> {competitor.fontes.meta_ads_data_coleta}
                            </div>
                        )}
                    </div>
                </section>
            )}
        </div>
    );
}

interface InfoCardProps {
    title: string;
    icon: React.ReactNode;
    color: 'cyan' | 'indigo' | 'amber' | 'emerald' | 'purple';
    children: React.ReactNode;
}

function InfoCard({ title, icon, color, children }: InfoCardProps) {
    const colors = {
        cyan: 'border-cyan-500/20',
        indigo: 'border-indigo-500/20',
        amber: 'border-amber-500/20',
        emerald: 'border-emerald-500/20',
        purple: 'border-purple-500/20',
    };

    return (
        <div className={`p-4 rounded-xl bg-zinc-900/30 border ${colors[color]}`}>
            <h4 className={`text-sm font-semibold mb-4 flex items-center gap-2 text-${color}-400`}>
                {icon}
                {title}
            </h4>
            <div className="space-y-3">
                {children}
            </div>
        </div>
    );
}

interface InfoRowProps {
    icon: React.ReactNode;
    label: string;
    value?: string;
    highlight?: 'positive' | 'negative' | 'warning' | 'neutral';
}

function InfoRow({ icon, label, value, highlight }: InfoRowProps) {
    const colors = {
        positive: 'text-emerald-400',
        negative: 'text-red-400',
        warning: 'text-amber-400',
        neutral: 'text-zinc-400',
    };

    if (!value) return null;

    return (
        <div className="flex items-start gap-2">
            <span className="text-zinc-600 mt-0.5">{icon}</span>
            <div className="flex-1">
                <div className="text-xs text-zinc-500">{label}</div>
                <div className={`text-sm ${highlight ? colors[highlight] : 'text-zinc-300'}`}>
                    {value}
                </div>
            </div>
        </div>
    );
}
