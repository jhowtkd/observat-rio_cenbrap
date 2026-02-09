import type { FC } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';

interface Player {
  nome: string;
  x: number; // Preço: 0 (Acessível) - 100 (Premium)
  y: number; // Modelo: 0 (100% Digital) - 100 (100% Presencial)
  tipo: 'nicho' | 'institucional';
  diferencial: string;
}

const concorrentes: Player[] = [
  // Nicho
  { nome: 'Liberdade Médica', x: 75, y: 50, tipo: 'nicho', diferencial: 'Híbrido, Premium' },
  { nome: 'Caduceu', x: 50, y: 85, tipo: 'nicho', diferencial: 'Presencial SP, Médio' },
  { nome: 'Comportamente', x: 25, y: 15, tipo: 'nicho', diferencial: 'EAD, Acessível' },
  { nome: 'IPM', x: 80, y: 90, tipo: 'nicho', diferencial: 'Presencial (4 unidades), Premium' },
  
  // Institucionais
  { nome: 'Sanar', x: 60, y: 20, tipo: 'institucional', diferencial: 'Digital/Ecossistema, Varia' },
  { nome: 'FGmed', x: 20, y: 10, tipo: 'institucional', diferencial: 'EAD, Acessível' },
  { nome: 'Unyleya', x: 15, y: 5, tipo: 'institucional', diferencial: '100% EAD, Acessível' },
  { nome: 'CDT', x: 85, y: 95, tipo: 'institucional', diferencial: 'Hands-on/Cadáveres, Premium' },
  { nome: 'Einstein', x: 90, y: 80, tipo: 'institucional', diferencial: 'Presencial, Premium' },
  { nome: 'PUCRS', x: 85, y: 60, tipo: 'institucional', diferencial: 'Presencial/EAD, Premium' },
  { nome: 'MEV', x: 75, y: 45, tipo: 'institucional', diferencial: 'Híbrido/Comunidade, Premium' },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: Player;
  }>;
}

const CustomTooltip: FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const player = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-[var(--color-text-primary)]">{player.nome}</p>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">{player.diferencial}</p>
        <div className="flex items-center gap-2 mt-2 text-xs">
          <span
            className={`px-2 py-0.5 rounded-full ${
              player.tipo === 'nicho'
                ? 'bg-red-100 text-red-700'
                : 'bg-blue-100 text-blue-700'
            }`}
          >
            {player.tipo === 'nicho' ? 'Nicho' : 'Institucional'}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const MapaPosicionamento: FC = () => {
  const nichoConcorrentes = concorrentes.filter((p) => p.tipo === 'nicho');
  const institucionalConcorrentes = concorrentes.filter((p) => p.tipo === 'institucional');

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
          Mapa de Posicionamento Competitivo
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Análise de posicionamento por preço e modelo de ensino
        </p>
      </div>

      {/* Legenda */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-sm text-[var(--color-text-secondary)]">Nicho (Vermelho)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-sm text-[var(--color-text-secondary)]">Institucional (Azul)</span>
        </div>
      </div>

      {/* Gráfico */}
      <div className="relative h-[500px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, bottom: 60, left: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            
            {/* Eixo X - Preço */}
            <XAxis
              type="number"
              dataKey="x"
              domain={[0, 100]}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#9ca3af' }}
              tickLine={{ stroke: '#9ca3af' }}
              label={{
                value: '← Acessível                Premium →',
                position: 'bottom',
                offset: 40,
                style: { fill: '#374151', fontSize: 12, fontWeight: 500 },
              }}
            />
            
            {/* Eixo Y - Modelo */}
            <YAxis
              type="number"
              dataKey="y"
              domain={[0, 100]}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#9ca3af' }}
              tickLine={{ stroke: '#9ca3af' }}
              label={{
                value: '← 100% Digital                100% Presencial →',
                angle: -90,
                position: 'insideLeft',
                offset: 40,
                style: { fill: '#374151', fontSize: 12, fontWeight: 500 },
              }}
            />
            
            {/* Linhas de referência no centro */}
            <ReferenceLine x={50} stroke="#9ca3af" strokeDasharray="5 5" />
            <ReferenceLine y={50} stroke="#9ca3af" strokeDasharray="5 5" />
            
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            
            {/* Concorrentes Nicho */}
            <Scatter
              name="Nicho"
              data={nichoConcorrentes}
              fill="#ef4444"
            >
              {nichoConcorrentes.map((_entry, index) => (
                <Cell key={`nicho-${index}`} fill="#ef4444" />
              ))}
            </Scatter>
            
            {/* Concorrentes Institucionais */}
            <Scatter
              name="Institucional"
              data={institucionalConcorrentes}
              fill="#3b82f6"
            >
              {institucionalConcorrentes.map((_entry, index) => (
                <Cell key={`inst-${index}`} fill="#3b82f6" />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>

        {/* Labels dos quadrantes */}
        <div className="absolute top-4 left-4 text-xs font-medium text-[var(--color-text-muted)] bg-white/80 px-2 py-1 rounded">
          Nicho Digital
        </div>
        <div className="absolute top-4 right-4 text-xs font-medium text-[var(--color-text-muted)] bg-white/80 px-2 py-1 rounded">
          Nicho Presencial
        </div>
        <div className="absolute bottom-16 left-4 text-xs font-medium text-[var(--color-text-muted)] bg-white/80 px-2 py-1 rounded">
          Institucional Digital
        </div>
        <div className="absolute bottom-16 right-4 text-xs font-medium text-[var(--color-text-muted)] bg-white/80 px-2 py-1 rounded">
          Institucional Premium
        </div>
      </div>

      {/* Lista de concorrentes */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            Concorrentes de Nicho
          </h3>
          <div className="space-y-2">
            {nichoConcorrentes.map((player) => (
              <div
                key={player.nome}
                className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-lg"
              >
                <span className="font-medium text-[var(--color-text-primary)]">{player.nome}</span>
                <span className="text-[var(--color-text-muted)] text-xs">{player.diferencial}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            Concorrentes Institucionais
          </h3>
          <div className="space-y-2">
            {institucionalConcorrentes.map((player) => (
              <div
                key={player.nome}
                className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-lg"
              >
                <span className="font-medium text-[var(--color-text-primary)]">{player.nome}</span>
                <span className="text-[var(--color-text-muted)] text-xs">{player.diferencial}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapaPosicionamento;
