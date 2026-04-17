import type { ReactNode } from 'react';
import type { SinglesMatchState, ScoreHistory } from '../types';

interface SinglesMatchProps {
  state: SinglesMatchState;
  scoreHistory: ScoreHistory;
  onScore: (scoringPlayer: 1 | 2) => void;
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
  const { player1Name, player2Name, player1Score, player2Score, currentServer, winner } = state;

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
              发球方: {currentServer === 1 ? player1Name : player2Name}
            </span>
          </div>

          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-center flex-1">
              <div className={`text-sm font-medium mb-2 ${currentServer === 1 ? 'text-blue-400' : 'text-gray-500'}`}>
                {currentServer === 1 && <span className="mr-1">发</span>}
                {player1Name}
              </div>
              <div className="text-6xl font-bold text-gray-800">{player1Score}</div>
              <button
                onClick={() => onScore(1)}
                disabled={!!winner}
                className="mt-4 w-full py-3 bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-bold rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                +1
              </button>
            </div>

            <div className="text-3xl font-bold text-gray-300">:</div>

            <div className="text-center flex-1">
              <div className={`text-sm font-medium mb-2 ${currentServer === 2 ? 'text-blue-400' : 'text-gray-500'}`}>
                {currentServer === 2 && <span className="mr-1">发</span>}
                {player2Name}
              </div>
              <div className="text-6xl font-bold text-gray-800">{player2Score}</div>
              <button
                onClick={() => onScore(2)}
                disabled={!!winner}
                className="mt-4 w-full py-3 bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-bold rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                +1
              </button>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500 mb-4">
            {state.extendMatch ? '加分模式' : '不加分'} · {state.matchPoint}分制
          </div>
        </div>

        {winner && (
          <div className="bg-gradient-to-r from-blue-400 to-cyan-400 text-white rounded-3xl p-6 text-center mb-4 shadow-lg">
            <div className="text-lg font-bold mb-2">比赛结束</div>
            <div className="text-3xl font-bold">
              {winner === 1 ? player1Name : player2Name} 获胜！
            </div>
            <div className="text-xl mt-2">
              {player1Score} : {player2Score}
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={onRestart}
                className="flex-1 py-3 bg-white text-blue-500 font-bold rounded-xl hover:bg-gray-100 transition-colors"
              >
                重新开始
              </button>
            </div>
          </div>
        )}

        {winner && scoreHistory.entries.length > 0 && (
          <div className="bg-white bg-opacity-90 rounded-3xl shadow-lg p-4 flex-1 overflow-hidden flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">得分历史</h3>
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white bg-opacity-90">
                  <tr className="text-gray-500 border-b">
                    <th className="py-2 text-center">序号</th>
                    <th className="py-2 text-center">得分方</th>
                    <th className="py-2 text-center">{player1Name}</th>
                    <th className="py-2 text-center">{player2Name}</th>
                  </tr>
                </thead>
                <tbody>
                  {scoreHistory.entries.map((entry) => (
                    <tr key={entry.sequenceNumber} className="border-b">
                      <td className="py-2 text-center">{entry.sequenceNumber}</td>
                      <td className="py-2 text-center">{entry.scoringSide}</td>
                      <td className="py-2 text-center">{entry.teamAScore}</td>
                      <td className="py-2 text-center">{entry.teamBScore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
