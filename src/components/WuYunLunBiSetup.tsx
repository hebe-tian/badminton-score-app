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

  const getDefaultPlayerName = (team: 'A' | 'B', index: number): string => {
    return `${team}${index + 1}`;
  };

  const updateTeamPlayer = (team: 'A' | 'B', index: number, value: string) => {
    const teamData = team === 'A' ? teamA : teamB;
    const newPlayers: [string, string, string, string, string] = [...teamData.players];
    // If input is empty, use default name (A1-A5, B1-B5)
    newPlayers[index] = value.trim() || getDefaultPlayerName(team, index);
    if (team === 'A') {
      onConfigChange({ teamA: { ...teamA, players: newPlayers } });
    } else {
      onConfigChange({ teamB: { ...teamB, players: newPlayers } });
    }
  };

  const handleFocus = (team: 'A' | 'B', index: number) => {
    const teamData = team === 'A' ? teamA : teamB;
    const defaultName = getDefaultPlayerName(team, index);
    // Clear the input if it contains the default name
    if (teamData.players[index] === defaultName) {
      const newPlayers: [string, string, string, string, string] = [...teamData.players];
      newPlayers[index] = '';
      if (team === 'A') {
        onConfigChange({ teamA: { ...teamA, players: newPlayers } });
      } else {
        onConfigChange({ teamB: { ...teamB, players: newPlayers } });
      }
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
                onFocus={() => handleFocus('A', index)}
                onBlur={() => updateTeamPlayer('A', index, name)}
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
                onFocus={() => handleFocus('B', index)}
                onBlur={() => updateTeamPlayer('B', index, name)}
                placeholder={`B${index + 1}`}
                className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all text-gray-800 bg-white"
              />
            </div>
          ))}
        </div>

        <div className="bg-white bg-opacity-90 rounded-3xl shadow-lg p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              发球球员 (仅限 A1/A2/B1/B2)
            </label>
            <select
              value={config.firstServerPlayer}
              onChange={(e) => {
                const server = e.target.value;
                // Auto-clear receiver when server changes (Scheme A)
                onConfigChange({ firstServerPlayer: server, firstReceiverPlayer: '' });
              }}
              className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all text-gray-800 bg-white"
            >
              <option value="" disabled>请选择发球球员</option>
              {[0, 1].map((i) => (
                <option key={`A${i}`} value={teamA.players[i]}>A{i + 1}: {teamA.players[i]}</option>
              ))}
              {[0, 1].map((i) => (
                <option key={`B${i}`} value={teamB.players[i]}>B{i + 1}: {teamB.players[i]}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              接发球球员
            </label>
            <select
              value={config.firstReceiverPlayer}
              onChange={(e) => onConfigChange({ firstReceiverPlayer: e.target.value })}
              disabled={!config.firstServerPlayer}
              className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all text-gray-800 bg-white disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="" disabled>请先选择发球球员</option>
              {config.firstServerPlayer && (() => {
                const isTeamA = config.firstServerPlayer === teamA.players[0] || config.firstServerPlayer === teamA.players[1];
                const targetTeam = isTeamA ? teamB : teamA;
                const prefix = isTeamA ? 'B' : 'A';
                return [0, 1].map((i) => (
                  <option key={`${prefix}${i}`} value={targetTeam.players[i]}>{prefix}{i + 1}: {targetTeam.players[i]}</option>
                ));
              })()}
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
