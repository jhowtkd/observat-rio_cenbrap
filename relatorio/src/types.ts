// ==========================================
// TIPOS DE FONTES E EVIDÊNCIAS
// ==========================================

export interface Source {
    tipo: 'site' | 'meta_ads' | 'google_ads' | 'instagram' | 'linkedin' | 'analise' | 'print';
    url?: string;
    data_coleta: string;
    screenshot?: string;
    observacao?: string;
}

export interface Evidence {
    id: string;
    tipo: 'screenshot' | 'video' | 'documento' | 'print_ads';
    url: string;
    descricao: string;
    data_coleta: string;
}

// ==========================================
// ESTRUTURAS BASE COM FONTES
// ==========================================

export interface PrecoComContexto {
    valor_total?: number;
    valor_mensal?: number;
    valor_semestre?: number;
    valor_modulo?: number;
    preco_avista?: string;
    preco_parcelado?: string;
    desconto_a_vista?: string;
    parcelamento_max?: number;
    garantia?: string;
    bonus_inclusos?: string[];
    observacao_preco?: string;
    
    // Contexto importante
    periodo_cobrado: 'total_curso' | 'mensal' | 'semestral' | 'por_modulo';
    duracao_meses?: number;
    inclui_material: boolean;
    inclui_certificado: boolean;
    taxa_matricula?: number;
    
    // Fonte
    preco_transparente: boolean;
    fonte: Source;
}

export interface SocialLinks {
    site?: {
        url: string;
        data_coleta?: string;
    };
    redes_sociais?: {
        instagram?: {
            url: string;
            handle?: string;
            seguidores: string;
            engajamento?: string;
            frequencia_posts?: string;
            posts?: string;
            seguindo?: string;
            data_coleta?: string;
        };
        facebook?: {
            url?: string;
            seguidores?: string;
            data_coleta?: string;
        };
        linkedin?: {
            url?: string;
            seguidores?: string;
            data_coleta?: string;
        };
        youtube?: {
            url?: string;
            inscritos?: string;
            data_coleta?: string;
        };
    };
    // Para compatibilidade com dados antigos
    instagram?: {
        url: string;
        handle?: string;
        seguidores: string;
        engajamento?: string;
        frequencia_posts?: string;
        posts?: string;
        seguindo?: string;
        data_coleta?: string;
    };
    facebook?: {
        url?: string;
        seguidores?: string;
        data_coleta?: string;
    };
    linkedin?: {
        url?: string;
        seguidores?: string;
        data_coleta?: string;
    };
    youtube?: {
        url?: string;
        inscritos?: string;
        data_coleta?: string;
    };
}

// ==========================================
// VULNERABILIDADE DETALHADA
// ==========================================

export interface Vulnerability {
    id: string;
    tipo: string;
    titulo: string;
    descricao: string;
    gravidade: 'alta' | 'media' | 'baixa';
    
    // Quem apresenta
    concorrentes_afetados: string[];
    
    // Como explorar
    como_atacar: string;
    
    // Contra-ataque recomendado
    contra_ataque: string;
    
    // Evidências
    evidencias: Evidence[];
    
    // Fonte da análise
    fonte_analise: Source;
    
    // Status
    status: 'identificada' | 'validada' | 'explorada';
}

// ==========================================
// ESTRUTURA DO CONCORRENTE
// ==========================================

export interface Competitor {
    id: string;
    nome: string;
    url: string;
    prioridade: 'alta' | 'media' | 'baixa';
    grupo: 'benchmark' | 'diretos' | 'institucionais';
    
    // Metadados da coleta
    status_coleta: 'completa' | 'parcial' | 'pendente';
    ultima_atualizacao: string;
    responsavel_coleta?: string;
    
    // Fontes principais
    fontes: {
        site_url: string;
        site_data_coleta: string;
        meta_ads_url?: string;
        meta_ads_data_coleta?: string;
        evidencias: Evidence[];
    };
    
    // Ficha cadastral
    ficha_cadastral?: {
        nome_completo?: string;
        natureza_juridica?: string;
        credenciamento_mec?: string;
        ano_fundacao?: number;
        alunos_formados?: string;
        modalidade?: string[];
        especialidades?: string[];
        sede?: string;
        cnpj?: string;
        
        // Fontes
        fonte_mec?: Source;
        fonte_dados?: Source;
    };
    
    // Posicionamento
    posicionamento?: {
        headline?: string;
        slogan?: string;
        tom_de_voz?: string;
        diferenciais_declarados?: string[];
        proposta_valor?: string;
        
        fonte: Source;
    };
    
    // Oferta e preço
    oferta?: PrecoComContexto;
    
    // Autoridade
    autoridade?: {
        corpo_docente_publico: boolean;
        professores_destacados?: string[];
        parcerias?: string[];
        certificacoes?: string[];
        casos_sucesso?: string;
        depoimentos_quantidade?: string;
        
        fonte: Source;
    };
    
    // Presença digital
    digital?: SocialLinks & {
        blog?: boolean;
        seo_organico?: string;
        
        fonte: Source;
    };
    
    // Tráfego pago
    trafego_pago?: {
        meta_ads?: {
            anuncios_ativos: number;
            investimento_estimado?: 'muito_baixo' | 'baixo' | 'medio' | 'alto' | 'muito_alto';
            investimento_valor_estimado?: string;
            formatos?: string[];
            angulos_copy?: string[];
            landing_pages?: string[];
            campanhas_ativas?: string[];
            
            fonte: Source;
        };
        google_ads?: {
            anuncios_ativos: boolean;
            palavras_chave?: string[];
            
            fonte: Source;
        };
    };
    
    // Landing page
    landing_page?: {
        url?: string;
        headline?: string;
        subheadline?: string;
        video_vendas?: {
            tem: boolean;
            duracao?: string;
            mensagem_principal?: string;
        };
        bullets_beneficios?: string[];
        prova_social?: {
            tipo?: string;
            quantidade?: string;
            identificacao: boolean;
        };
        formulario?: {
            campos: string[];
            cta?: string;
        };
        escassez?: string;
        urgencia?: string;
        
        fonte: Source;
    };
    
    // Funil
    funil?: {
        email_sequence: boolean;
        whatsapp_contato: boolean;
        redirect_pos_cadastro?: string;
        tempo_resposta?: string;
        
        fonte: Source;
    };
    
    // Vulnerabilidades
    vulnerabilidades?: Vulnerability[];
    
    // SWOT
    swot?: {
        forcas?: string[];
        fraquezas?: string[];
        oportunidades?: string[];
        ameacas?: string[];
    };
    
    // Benchmarking
    benchmarking?: {
        preco_vs_mercado?: 'acima' | 'media' | 'abaixo';
        preco_vs_media_percentual?: number;
        ads_vs_mercado?: 'acima' | 'media' | 'abaixo';
        engajamento_vs_mercado?: 'acima' | 'media' | 'abaixo';
    };
}

// ==========================================
// TIPOS DO DASHBOARD
// ==========================================

export interface DashboardData {
    metadata: {
        projeto: string;
        data_criacao: string;
        total_concorrentes: number;
        versao: string;
        ultima_atualizacao: string;
    };
    grupos: {
        diretos: {
            nome: string;
            descricao: string;
            concorrentes: string[];
        };
        institucionais: {
            nome: string;
            descricao: string;
            concorrentes: string[];
        };
    };
    concorrentes: Record<string, Competitor>;
}

export interface KPIData {
    total_concorrentes: number;
    concorrentes_com_ads: number;
    media_preco_mercado: number;
    vulnerabilidades_criticas: number;
    maior_investidor_ads: string;
    atualizacao_recente: string;
}

export interface AlertItem {
    id: string;
    tipo: 'info' | 'warning' | 'critical';
    mensagem: string;
    data: string;
    concorrente?: string;
}

export interface OpportunityItem {
    id: string;
    titulo: string;
    descricao: string;
    impacto: 'alto' | 'medio' | 'baixo';
    esforco: 'alto' | 'medio' | 'baixo';
    concorrentes_afetados?: string[];
}

// ==========================================
// PROPS DE COMPONENTES
// ==========================================

export interface CompetitorCardProps {
    competitor: Competitor;
    isSelected: boolean;
    onClick: () => void;
}

export interface TabProps {
    competitor: Competitor;
}

export interface ChartProps {
    competitors: Competitor[];
    selectedCompetitor?: Competitor;
}

export interface VulnerabilityCardProps {
    vulnerability: Vulnerability;
    expanded?: boolean;
}

export interface SourceBadgeProps {
    source: Source;
    showDate?: boolean;
}

export interface EvidenceGalleryProps {
    evidences: Evidence[];
}
