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
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-orange-50 p-4">
      <header className="flex items-center mb-8 pt-4">
        <button
          onClick={onBack}
          className="p-2 text-gray-500 hover:text-pink-400 transition-colors"
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
              选手1名称
            </label>
            <input
              type="text"
              value={config.player1Name}
              onChange={(e) => onConfigChange({ player1Name: e.target.value })}
              placeholder="选手1"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all text-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              选手2名称
            </label>
            <input
              type="text"
              value={config.player2Name}
              onChange={(e) => onConfigChange({ player2Name: e.target.value })}
              placeholder="选手2"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all text-gray-800"
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
                      ? 'bg-pink-400 text-white border-pink-400 shadow-md'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-pink-300'
                  }`}
                >
                  {point} 分
                </button>
              ))}
              <input
                type="number"
                value={typeof config.matchPoint === 'number' ? config.matchPoint : ''}
                onChange={(e) => onConfigChange({ matchPoint: parseInt(e.target.value) || 21 })}
                placeholder="自定义"
                className="flex-1 py-3 px-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all text-gray-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              加分规则
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => onConfigChange({ extendMatch: false })}
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all font-medium ${
                  !config.extendMatch
                    ? 'bg-pink-400 text-white border-pink-400 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-pink-300'
                }`}
              >
                不加分
              </button>
              <button
                onClick={() => onConfigChange({ extendMatch: true })}
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all font-medium ${
                  config.extendMatch
                    ? 'bg-pink-400 text-white border-pink-400 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-pink-300'
                }`}
              >
                加分（领先2分获胜）
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              首发发球方
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => onConfigChange({ firstServer: 1 })}
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all font-medium ${
                  config.firstServer === 1
                    ? 'bg-pink-400 text-white border-pink-400 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-pink-300'
                }`}
              >
                {config.player1Name || '选手1'}
              </button>
              <button
                onClick={() => onConfigChange({ firstServer: 2 })}
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all font-medium ${
                  config.firstServer === 2
                    ? 'bg-pink-400 text-white border-pink-400 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-pink-300'
                }`}
              >
                {config.player2Name || '选手2'}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full py-4 bg-gradient-to-r from-pink-400 to-orange-400 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:from-pink-500 hover:to-orange-500 transition-all"
        >
          开始比赛
        </button>
      </div>
    </div>
  );
}
