import type { ReactNode } from 'react';
import type { WuYunLunBiMatchConfig } from '../types';

interface WuYunLunBiSetupProps {
  config: WuYunLunBiMatchConfig;
  onConfigChange: (config: Partial<WuYunLunBiMatchConfig>) => void;
  onStart: () => void;
  onBack: () => void;
}

export default function WuYunLunBiSetup({
  config,
  onConfigChange,
  onStart,
  onBack,
}: WuYunLunBiSetupProps): ReactNode {
  const { teamA, teamB } = config;

  const updateTeamPlayer = (team: 'A' | 'B', index: number, value: string) => {
    const teamData = team === 'A' ? teamA : teamB;
    const newPlayers: [string, string, string, string, string] = [...teamData.players];
    newPlayers[index] = value;
    if (team === 'A') {
      onConfigChange({ teamA: { ...teamA, players: newPlayers } });
    } else {
      onConfigChange({ teamB: { ...teamB, players: newPlayers } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-rose-50 p-4">
      <header className="flex items-center mb-8 pt-4">
        <button
          onClick={onBack}
          className="p-2 text-gray-500 hover:text-pink-400 transition-colors"
        >
          ←
        </button>
        <h1 className="text-xl font-bold text-gray-800 flex-1 text-center pr-8">
          五羽伦比配置
        </h1>
      </header>

      <div className="max-w-md mx-auto space-y-6">
        <div className="bg-white bg-opacity-90 rounded-3xl shadow-lg p-6 space-y-5">
          <h2 className="text-lg font-bold text-gray-800">A队</h2>
          {teamA.players.map((name, index) => (
            <div key={`A${index + 1}`}>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                A{index + 1} 名称
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => updateTeamPlayer('A', index, e.target.value)}
                placeholder={`A${index + 1}`}
                className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all text-gray-800 bg-white"
              />
            </div>
          ))}
        </div>

        <div className="bg-white bg-opacity-90 rounded-3xl shadow-lg p-6 space-y-5">
          <h2 className="text-lg font-bold text-gray-800">B队</h2>
          {teamB.players.map((name, index) => (
            <div key={`B${index + 1}`}>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                B{index + 1} 名称
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => updateTeamPlayer('B', index, e.target.value)}
                placeholder={`B${index + 1}`}
                className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all text-gray-800 bg-white"
              />
            </div>
          ))}
        </div>

        <div className="bg-white bg-opacity-90 rounded-3xl shadow-lg p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              首发发球队
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => onConfigChange({ firstServerTeam: 'A' })}
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all font-medium ${
                  config.firstServerTeam === 'A'
                    ? 'bg-pink-400 text-white border-pink-400 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-pink-300'
                }`}
              >
                A队
              </button>
              <button
                onClick={() => onConfigChange({ firstServerTeam: 'B' })}
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all font-medium ${
                  config.firstServerTeam === 'B'
                    ? 'bg-pink-400 text-white border-pink-400 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-pink-300'
                }`}
              >
                B队
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              首发发球球员
            </label>
            <select
              value={config.firstServerPlayer}
              onChange={(e) => onConfigChange({ firstServerPlayer: e.target.value })}
              className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all text-gray-800 bg-white"
            >
              {teamA.players.map((name, i) => (
                <option key={`A${i}`} value={name}>A{i + 1}: {name}</option>
              ))}
              {teamB.players.map((name, i) => (
                <option key={`B${i}`} value={name}>B{i + 1}: {name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              首发接发球球员
            </label>
            <select
              value={config.firstReceiverPlayer}
              onChange={(e) => onConfigChange({ firstReceiverPlayer: e.target.value })}
              className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all text-gray-800 bg-white"
            >
              {teamB.players.map((name, i) => (
                <option key={`B${i}`} value={name}>B{i + 1}: {name}</option>
              ))}
              {teamA.players.map((name, i) => (
                <option key={`A${i}`} value={name}>A{i + 1}: {name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              比赛总分
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => onConfigChange({ totalPoints: 50 })}
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all font-medium ${
                  config.totalPoints === 50
                    ? 'bg-pink-400 text-white border-pink-400 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-pink-300'
                }`}
              >
                50 分
              </button>
              <button
                onClick={() => onConfigChange({ totalPoints: 100 })}
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all font-medium ${
                  config.totalPoints === 100
                    ? 'bg-pink-400 text-white border-pink-400 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-pink-300'
                }`}
              >
                100 分
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full py-4 bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:from-pink-500 hover:to-rose-500 transition-all"
        >
          开始比赛
        </button>
      </div>
    </div>
  );
}
