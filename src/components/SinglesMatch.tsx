import { useState, useEffect, type ReactNode } from 'react';
import type { SinglesMatchState, ScoreHistory } from '../types';
import ScoreRecordModal from './ScoreRecordModal';

interface SinglesMatchProps {
  state: SinglesMatchState;
  scoreHistory: ScoreHistory;
  onScore: (scoringTeam: 'A' | 'B') => void;
  onRestart: () => void;
  onBack: () => void;
}

export default function SinglesMatch({
  state,
  scoreHistory,
  onScore,
  onRestart,
  onBack,
}: SinglesMatchProps): ReactNode {
  const { teamAName, teamBName, teamAScore, teamBScore, currentServer, winner } = state;
  const [showRecord, setShowRecord] = useState(false);

  useEffect(() => {
    if (winner && !showRecord) {
      setShowRecord(true);
    }
  }, [winner]);

  const handleBackToHome = () => {
    setShowRecord(false);
    onRestart(); // 先重置当前比赛状态
    onBack();    // 再返回主页
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50 flex flex-col">
      <header className="flex items-center p-4 bg-white bg-opacity-80 shadow-sm">
        <button onClick={onBack} className="p-2 text-gray-500 hover:text-blue-400 transition-colors">
          ←
        </button>
        <h1 className="text-lg font-bold text-gray-800 flex-1 text-center pr-8">单打比赛</h1>
      </header>

      <div className="flex-1 flex flex-col p-4 max-w-lg mx-auto w-full">
        <div className="bg-white bg-opacity-90 rounded-3xl shadow-lg p-6 mb-4">
          <div className="text-center mb-4">
            <span className="text-sm text-blue-400 font-medium">
              发球方: {currentServer === 'A' ? teamAName : teamBName}
            </span>
          </div>

          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-center flex-1">
              <div className={`text-sm font-medium mb-2 ${currentServer === 'A' ? 'text-blue-400' : 'text-gray-500'}`}>
                {currentServer === 'A' && <span className="mr-1">发</span>}
                {teamAName}
              </div>
              <div className="text-6xl font-bold text-gray-800">{teamAScore}</div>
              <button
                onClick={() => onScore('A')}
                disabled={!!winner}
                className="mt-4 w-full py-3 bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-bold rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                A队得分
              </button>
            </div>

            <div className="text-3xl font-bold text-gray-300">:</div>

            <div className="text-center flex-1">
              <div className={`text-sm font-medium mb-2 ${currentServer === 'B' ? 'text-blue-400' : 'text-gray-500'}`}>
                {currentServer === 'B' && <span className="mr-1">发</span>}
                {teamBName}
              </div>
              <div className="text-6xl font-bold text-gray-800">{teamBScore}</div>
              <button
                onClick={() => onScore('B')}
                disabled={!!winner}
                className="mt-4 w-full py-3 bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-bold rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                B队得分
              </button>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500 mb-4">
            {state.extendMatch ? '加分模式' : '不加分'} · {state.matchPoint}分制
          </div>
        </div>

        {winner && showRecord && (
          <ScoreRecordModal 
            entries={scoreHistory.entries}
            mode="singles"
            onClose={() => setShowRecord(false)}
            onBackToHome={handleBackToHome}
            themeColor="blue"
            matchResult={scoreHistory.matchResult}
            teamAPlayers={[state.teamAName]}
            teamBPlayers={[state.teamBName]}
          />
        )}
      </div>
    </div>
  );
}
