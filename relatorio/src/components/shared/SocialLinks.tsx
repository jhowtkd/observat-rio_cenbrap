import { Globe, Instagram, Linkedin, Facebook, Youtube, ExternalLink } from 'lucide-react';
import type { SocialLinks as SocialLinksType } from '../../types';

interface SocialLinksProps {
    social: SocialLinksType;
    showStats?: boolean;
}

export function SocialLinksBlock({ social, showStats = true }: SocialLinksProps) {
    // Normalizar dados - usar redes_sociais se disponível
    const rs = social.redes_sociais;
    
    const links = [
        {
            id: 'site',
            name: 'Website',
            icon: <Globe className="w-4 h-4" />,
            url: social.site?.url,
            stats: null,
            color: 'cyan',
        },
        {
            id: 'instagram',
            name: 'Instagram',
            icon: <Instagram className="w-4 h-4" />,
            url: rs?.instagram?.url || social.instagram?.url,
            handle: rs?.instagram?.handle || social.instagram?.handle,
            stats: rs?.instagram?.seguidores || social.instagram?.seguidores,
            subStats: (rs?.instagram?.engajamento || social.instagram?.engajamento) ? 
                `Eng. ${rs?.instagram?.engajamento || social.instagram?.engajamento}` : null,
            extraStats: (rs?.instagram?.posts || social.instagram?.posts) ? 
                `${rs?.instagram?.posts || social.instagram?.posts} posts` : null,
            following: rs?.instagram?.seguindo || social.instagram?.seguindo,
            color: 'pink',
        },
        {
            id: 'linkedin',
            name: 'LinkedIn',
            icon: <Linkedin className="w-4 h-4" />,
            url: rs?.linkedin?.url || social.linkedin?.url,
            stats: rs?.linkedin?.seguidores || social.linkedin?.seguidores,
            color: 'blue',
        },
        {
            id: 'facebook',
            name: 'Facebook',
            icon: <Facebook className="w-4 h-4" />,
            url: rs?.facebook?.url || social.facebook?.url,
            stats: rs?.facebook?.seguidores || social.facebook?.seguidores,
            color: 'indigo',
        },
        {
            id: 'youtube',
            name: 'YouTube',
            icon: <Youtube className="w-4 h-4" />,
            url: rs?.youtube?.url || social.youtube?.url,
            stats: rs?.youtube?.inscritos || social.youtube?.inscritos,
            color: 'red',
        },
    ];

    const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
        cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
        pink: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20' },
        blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
        indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
        red: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
    };

    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {links.map((link) => {
                if (!link.url) return null;
                
                const colors = colorClasses[link.color];
                
                return (
                    <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`
                            group flex items-center gap-3 p-3 rounded-xl border transition-all duration-200
                            ${colors.bg} ${colors.border} hover:bg-opacity-20
                        `}
                    >
                        <div className={`${colors.text}`}>
                            {link.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                                <span className={`text-sm font-medium ${colors.text}`}>
                                    {link.name}
                                </span>
                                <ExternalLink className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                            </div>
                            {showStats && link.stats && (
                                <div className="text-xs text-zinc-400">
                                    {link.stats} {link.id === 'youtube' ? 'inscritos' : 'seguidores'}
                                    {'following' in link && link.following && (
                                        <span className="text-zinc-500"> · {link.following} seguindo</span>
                                    )}
                                </div>
                            )}
                            {'extraStats' in link && link.extraStats && (
                                <div className="text-[10px] text-zinc-500">
                                    {link.extraStats}
                                </div>
                            )}
                            {'handle' in link && link.handle && (
                                <div className="text-[10px] text-zinc-500">
                                    {link.handle}
                                </div>
                            )}
                        </div>
                    </a>
                );
            })}
        </div>
    );
}

// Versão compacta para cards
export function SocialLinksCompact({ social }: { social: SocialLinksType }) {
    const links: { icon: React.ReactElement; url: string; label: string }[] = [];
    
    if (social.site?.url) {
        links.push({ icon: <Globe className="w-3 h-3" />, url: social.site.url, label: 'Site' });
    }
    if (social.instagram?.url) {
        links.push({ icon: <Instagram className="w-3 h-3" />, url: social.instagram.url, label: 'IG' });
    }
    if (social.linkedin?.url) {
        links.push({ icon: <Linkedin className="w-3 h-3" />, url: social.linkedin.url, label: 'in' });
    }
    if (social.facebook?.url) {
        links.push({ icon: <Facebook className="w-3 h-3" />, url: social.facebook.url, label: 'FB' });
    }
    if (social.youtube?.url) {
        links.push({ icon: <Youtube className="w-3 h-3" />, url: social.youtube.url, label: 'YT' });
    }

    if (links.length === 0) {
        return (
            <div className="text-xs text-zinc-600 italic">
                Sem links sociais mapeados
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 flex-wrap">
            {links.map((link, idx) => (
                <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-6 h-6 rounded-md bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
                    title={link.label}
                >
                    {link.icon}
                </a>
            ))}
        </div>
    );
}
