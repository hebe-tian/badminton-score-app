import type { ReactNode } from 'react';

interface ModeCardProps {
  title: string;
  description: string;
  onClick: () => void;
  colorScheme: 'blue' | 'green' | 'pink';
}

function ModeCard({ title, description, onClick, colorScheme }: ModeCardProps): ReactNode {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200 hover:border-blue-300',
      accent: 'text-blue-500',
      gradient: 'from-blue-200 to-cyan-200',
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200 hover:border-green-300',
      accent: 'text-green-500',
      gradient: 'from-green-200 to-emerald-200',
    },
    pink: {
      bg: 'bg-pink-50',
      border: 'border-pink-200 hover:border-pink-300',
      accent: 'text-pink-500',
      gradient: 'from-pink-200 to-rose-200',
    },
  };

  const colors = colorClasses[colorScheme];

  return (
    <button
      onClick={onClick}
      className={`w-full p-6 ${colors.bg} rounded-2xl shadow-md hover:shadow-lg transition-all text-left border-2 ${colors.border} active:scale-98`}
    >
      <h2 className={`text-xl font-bold mb-2 ${colors.accent}`}>{title}</h2>
      <p className="text-gray-500 text-sm">{description}</p>
    </button>
  );
}

interface ModeSelectProps {
  onSelectMode: (mode: 'singles' | 'doubles' | 'wu-yun-lun-bi') => void;
}

export default function ModeSelect({ onSelectMode }: ModeSelectProps): ReactNode {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-orange-50 p-4">
      <header className="text-center mb-10 pt-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">🏸 羽毛球计分器</h1>
        <p className="text-gray-500">选择比赛模式开始</p>
      </header>

      <div className="space-y-5 max-w-md mx-auto">
        <ModeCard
          title="单打"
          description="1v1 单人比赛模式"
          onClick={() => onSelectMode('singles')}
          colorScheme="blue"
        />
        <ModeCard
          title="双打"
          description="2v2 双人比赛模式"
          onClick={() => onSelectMode('doubles')}
          colorScheme="green"
        />
        <ModeCard
          title="五羽伦比"
          description="5v5 五人团体赛"
          onClick={() => onSelectMode('wu-yun-lun-bi')}
          colorScheme="pink"
        />
      </div>
    </div>
  );
}
