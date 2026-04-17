import type { ReactNode } from 'react';
import type { DoublesMatchConfig } from '../types';

interface DoublesSetupProps {
  config: DoublesMatchConfig;
  onConfigChange: (config: Partial<DoublesMatchConfig>) => void;
  onStart: () => void;
  onBack: () => void;
}

export default function DoublesSetup({
  config,
  onConfigChange,
  onStart,
  onBack,
}: DoublesSetupProps): ReactNode {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 p-4">
      <header className="flex items-center mb-8 pt-4">
        <button
          onClick={onBack}
          className="p-2 text-gray-500 hover:text-green-400 transition-colors"
        >
          ←
        </button>
        <h1 className="text-xl font-bold text-gray-800 flex-1 text-center pr-8">
          双打配置
        </h1>
      </header>

      <div className="max-w-md mx-auto space-y-6">
        <div className="bg-white bg-opacity-90 rounded-3xl shadow-lg p-6 space-y-5">
          <h2 className="text-lg font-bold text-gray-800">A队</h2>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              A1 名称
            </label>
            <input
              type="text"
              value={config.teamA.player1Name}
              onChange={(e) => onConfigChange({
                teamA: { ...config.teamA, player1Name: e.target.value }
              })}
              placeholder="A1"
              className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-300 focus:border-green-300 transition-all text-gray-800 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              A2 名称
            </label>
            <input
              type="text"
              value={config.teamA.player2Name}
              onChange={(e) => onConfigChange({
                teamA: { ...config.teamA, player2Name: e.target.value }
              })}
              placeholder="A2"
              className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-300 focus:border-green-300 transition-all text-gray-800 bg-white"
            />
          </div>
        </div>

        <div className="bg-white bg-opacity-90 rounded-3xl shadow-lg p-6 space-y-5">
          <h2 className="text-lg font-bold text-gray-800">B队</h2>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              B1 名称
            </label>
            <input
              type="text"
              value={config.teamB.player1Name}
              onChange={(e) => onConfigChange({
                teamB: { ...config.teamB, player1Name: e.target.value }
              })}
              placeholder="B1"
              className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-300 focus:border-green-300 transition-all text-gray-800 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              B2 名称
            </label>
            <input
              type="text"
              value={config.teamB.player2Name}
              onChange={(e) => onConfigChange({
                teamB: { ...config.teamB, player2Name: e.target.value }
              })}
              placeholder="B2"
              className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-300 focus:border-green-300 transition-all text-gray-800 bg-white"
            />
          </div>
        </div>

        <div className="bg-white bg-opacity-90 rounded-3xl shadow-lg p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              比赛分值
            </label>
            <div className="flex gap-3">
              {[15, 21].map((point) => (
                <button
                  key={point}
                  onClick={() => onConfigChange({ matchPoint: point })}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all font-medium ${
                    config.matchPoint === point
                      ? 'bg-green-400 text-white border-green-400 shadow-md'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'
                  }`}
                >
                  {point} 分
                </button>
              ))}
              <input
                type="number"
                value={typeof config.matchPoint === 'number' ? config.matchPoint : ''}
                onChange={(e) => onConfigChange({ matchPoint: parseInt(e.target.value) || 21 })}
                className="flex-1 px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-300 focus:border-green-300 transition-all text-gray-800 bg-white text-center"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              赛制
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => onConfigChange({ extendMatch: false })}
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all font-medium ${
                  config.extendMatch === false
                    ? 'bg-green-400 text-white border-green-400 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'
                }`}
              >
                不加分
              </button>
              <button
                onClick={() => onConfigChange({ extendMatch: true })}
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all font-medium ${
                  config.extendMatch === true
                    ? 'bg-green-400 text-white border-green-400 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'
                }`}
              >
                加分
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              首发发球队
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => onConfigChange({ firstServerTeam: 'A' })}
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all font-medium ${
                  config.firstServerTeam === 'A'
                    ? 'bg-green-400 text-white border-green-400 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'
                }`}
              >
                A队
              </button>
              <button
                onClick={() => onConfigChange({ firstServerTeam: 'B' })}
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all font-medium ${
                  config.firstServerTeam === 'B'
                    ? 'bg-green-400 text-white border-green-400 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'
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
              className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-300 focus:border-green-300 transition-all text-gray-800 bg-white"
            >
              <option value={config.teamA.player1Name}>
                A1: {config.teamA.player1Name || 'A1'}
              </option>
              <option value={config.teamA.player2Name}>
                A2: {config.teamA.player2Name || 'A2'}
              </option>
              <option value={config.teamB.player1Name}>
                B1: {config.teamB.player1Name || 'B1'}
              </option>
              <option value={config.teamB.player2Name}>
                B2: {config.teamB.player2Name || 'B2'}
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              首发接发球球员
            </label>
            <select
              value={config.firstReceiverPlayer}
              onChange={(e) => onConfigChange({ firstReceiverPlayer: e.target.value })}
              className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-300 focus:border-green-300 transition-all text-gray-800 bg-white"
            >
              <option value={config.teamB.player1Name}>
                B1: {config.teamB.player1Name || 'B1'}
              </option>
              <option value={config.teamB.player2Name}>
                B2: {config.teamB.player2Name || 'B2'}
              </option>
              <option value={config.teamA.player1Name}>
                A1: {config.teamA.player1Name || 'A1'}
              </option>
              <option value={config.teamA.player2Name}>
                A2: {config.teamA.player2Name || 'A2'}
              </option>
            </select>
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full py-4 bg-gradient-to-r from-green-400 to-emerald-400 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:from-green-500 hover:to-emerald-500 transition-all"
        >
          开始比赛
        </button>
      </div>
    </div>
  );
}
