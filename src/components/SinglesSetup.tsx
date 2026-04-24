import type { ReactNode } from 'react';
import type { SinglesMatchConfig } from '../types';

interface SinglesSetupProps {
  config: SinglesMatchConfig;
  onConfigChange: (config: Partial<SinglesMatchConfig>) => void;
  onStart: () => void;
  onBack: () => void;
}

export default function SinglesSetup({
  config,
  onConfigChange,
  onStart,
  onBack,
}: SinglesSetupProps): ReactNode {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50 p-4">
      <header className="flex items-center mb-8 pt-4">
        <button
          onClick={onBack}
          className="p-2 text-gray-500 hover:text-blue-400 transition-colors"
        >
          ←
        </button>
        <h1 className="text-xl font-bold text-gray-800 flex-1 text-center pr-8">
          单打配置
        </h1>
      </header>

      <div className="max-w-md mx-auto space-y-6">
        <div className="bg-white bg-opacity-90 rounded-3xl shadow-lg p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              A队球员
            </label>
            <input
              type="text"
              value={config.teamAName}
              onChange={(e) => onConfigChange({ teamAName: e.target.value })}
              placeholder="A"
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all text-gray-800 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              B队球员
            </label>
            <input
              type="text"
              value={config.teamBName}
              onChange={(e) => onConfigChange({ teamBName: e.target.value })}
              placeholder="B"
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all text-gray-800 bg-white"
            />
          </div>

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
                      ? 'bg-blue-400 text-white border-blue-400 shadow-md'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {point} 分
                </button>
              ))}
              <input
                type="number"
                value={typeof config.matchPoint === 'number' ? config.matchPoint : ''}
                onChange={(e) => onConfigChange({ matchPoint: parseInt(e.target.value) || 21 })}
                className="flex-1 px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all text-gray-800 bg-white text-center"
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
                    ? 'bg-blue-400 text-white border-blue-400 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                }`}
              >
                不加分
              </button>
              <button
                onClick={() => onConfigChange({ extendMatch: true })}
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all font-medium ${
                  config.extendMatch === true
                    ? 'bg-blue-400 text-white border-blue-400 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                }`}
              >
                加分
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              首发球员
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => onConfigChange({ firstServer: 'A' })}
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all font-medium ${
                  config.firstServer === 'A'
                    ? 'bg-blue-400 text-white border-blue-400 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                }`}
              >
                {config.teamAName || 'A'}
              </button>
              <button
                onClick={() => onConfigChange({ firstServer: 'B' })}
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all font-medium ${
                  config.firstServer === 'B'
                    ? 'bg-blue-400 text-white border-blue-400 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                }`}
              >
                {config.teamBName || 'B'}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full py-4 bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:from-blue-500 hover:to-cyan-500 transition-all"
        >
          开始比赛
        </button>
      </div>
    </div>
  );
}
