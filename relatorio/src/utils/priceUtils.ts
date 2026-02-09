/**
 * Utilitários para formatação de preços
 * Converte valores numéricos em faixas de preço ($, $$, $$$)
 */

export type PriceRange = '$' | '$$' | '$$$' | '?';

export interface PriceRangeConfig {
  range: PriceRange;
  label: string;
  description: string;
  min: number;
  max: number;
  color: string;
}

// Configuração das faixas de preço
export const PRICE_RANGES: PriceRangeConfig[] = [
  {
    range: '$',
    label: 'Acessível',
    description: 'Até R$ 4.000',
    min: 0,
    max: 4000,
    color: '#10b981', // emerald
  },
  {
    range: '$$',
    label: 'Médio',
    description: 'R$ 4.000 - R$ 7.000',
    min: 4000,
    max: 7000,
    color: '#f59e0b', // amber
  },
  {
    range: '$$$',
    label: 'Superior',
    description: 'Acima de R$ 7.000',
    min: 7000,
    max: Infinity,
    color: '#ef4444', // red
  },
];

/**
 * Converte um valor numérico em faixa de preço ($, $$, $$$)
 */
export function getPriceRange(value?: number | null): PriceRange {
  if (value === undefined || value === null || value === 0) {
    return '?';
  }

  for (const config of PRICE_RANGES) {
    if (value > config.min && value <= config.max) {
      return config.range;
    }
  }

  return '?';
}

/**
 * Retorna a configuração completa da faixa de preço
 */
export function getPriceRangeConfig(value?: number | null): PriceRangeConfig | null {
  const range = getPriceRange(value);
  if (range === '?') return null;
  return PRICE_RANGES.find(r => r.range === range) || null;
}

/**
 * Formata o preço como string com símbolos $, $$, $$$
 * Inclui tooltip com a descrição da faixa
 */
export function formatPriceRange(value?: number | null, showTooltip = true): string {
  const range = getPriceRange(value);
  
  if (range === '?') {
    return 'Preço sob consulta';
  }

  const config = getPriceRangeConfig(value);
  if (!config) return range;

  if (showTooltip) {
    return `${range} (${config.description})`;
  }

  return range;
}

/**
 * Retorna a cor associada à faixa de preço
 */
export function getPriceRangeColor(value?: number | null): string {
  const config = getPriceRangeConfig(value);
  return config?.color || '#71717a';
}

/**
 * Retorna o label descritivo da faixa de preço
 */
export function getPriceRangeLabel(value?: number | null): string {
  const config = getPriceRangeConfig(value);
  return config?.label || 'Não informado';
}
