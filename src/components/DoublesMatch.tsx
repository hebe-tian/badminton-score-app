import type { ReactNode } from 'react';
import type { DoublesMatchState, ScoreHistory } from '../types';

interface DoublesMatchProps {
  state: DoublesMatchState;
  scoreHistory: ScoreHistory;
  onScore: (scoringTeam: 'A' | 'B') => void;
  onRestart: () => void;
  onBack: () => void;
}

export default function DoublesMatch({
  state,
  scoreHistory,
  onScore,
  onRestart,
  onBack,
}: DoublesMatchProps): ReactNode {
  const { 
    teamA, 
    teamB, 
    teamAScore, 
    teamBScore, 
    currentServerTeam, 
    currentServerPlayer, 
    currentReceiverPlayer, 
    winner,
    teamAPositions,
    teamBPositions
  } = state;

  // 根据球员标识符（A1/A2/B1/B2）获取显示名称
  const getPlayerDisplayName = (playerId: string): string => {
    switch (playerId) {
      case 'A1':
        return teamA.player1Name || 'A1';
      case 'A2':
        return teamA.player2Name || 'A2';
      case 'B1':
        return teamB.player1Name || 'B1';
      case 'B2':
        return teamB.player2Name || 'B2';
      default:
        return playerId;
    }
  };
  
  // 获取球员显示名称，如果是发球方或接发球方则添加标注
  const getPlayerWithLabel = (playerId: string, team: 'A' | 'B') => {
    const name = getPlayerDisplayName(playerId);
    const isServer = playerId === currentServerPlayer && currentServerTeam === team;
    const isReceiver = playerId === currentReceiverPlayer && currentServerTeam !== team;
    
    if (isServer) {
      return (
        <span className="text-green-400 font-medium">
          {name}<span className="ml-1 text-xs">发</span>
        </span>
      );
    }
    if (isReceiver) {
      return (
        <span>
          {name}<span className="ml-1 text-xs text-orange-400">接</span>
        </span>
      );
    }
    return <span>{name}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 flex flex-col">
      <header className="flex items-center p-4 bg-white bg-opacity-80 shadow-sm">
        <button onClick={onBack} className="p-2 text-gray-500 hover:text-green-400 transition-colors">
          ←
        </button>
        <h1 className="text-lg font-bold text-gray-800 flex-1 text-center pr-8">双打比赛</h1>
      </header>

      <div className="flex-1 flex flex-col p-4 max-w-lg mx-auto w-full">
        <div className="bg-white bg-opacity-90 rounded-3xl shadow-lg p-6 mb-4">
          {/* 发球信息 */}
          <div className="text-center mb-4">
            <span className="text-sm text-green-400 font-medium">
              发球方: {currentServerTeam}队 · {getPlayerDisplayName(currentServerPlayer)}
            </span>
          </div>

          {/* 场地布局：A队左双右单，B队左单右双（面对面站位） */}
          <div className="space-y-4 mb-6">
            {/* A队行：左侧双数区，右侧单数区 */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-2 text-center">A队</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-xs text-gray-400 mb-1">双数区</div>
                  <div className="text-sm font-medium">
                    {getPlayerWithLabel(teamAPositions.evenCourtPlayer, 'A')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-400 mb-1">单数区</div>
                  <div className="text-sm font-medium">
                    {getPlayerWithLabel(teamAPositions.oddCourtPlayer, 'A')}
                  </div>
                </div>
              </div>
            </div>

            {/* B队行：左侧单数区，右侧双数区（与A队相反） */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-2 text-center">B队</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-xs text-gray-400 mb-1">单数区</div>
                  <div className="text-sm font-medium">
                    {getPlayerWithLabel(teamBPositions.oddCourtPlayer, 'B')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-400 mb-1">双数区</div>
                  <div className="text-sm font-medium">
                    {getPlayerWithLabel(teamBPositions.evenCourtPlayer, 'B')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 比分和得分按钮 */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-center flex-1">
              <div className="text-5xl font-bold text-gray-800 mb-3">{teamAScore}</div>
              <button
                onClick={() => onScore('A')}
                disabled={!!winner}
                className="w-full py-3 bg-gradient-to-r from-green-400 to-emerald-400 text-white font-bold rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                A队得分
              </button>
            </div>

            <div className="text-3xl font-bold text-gray-300">:</div>

            <div className="text-center flex-1">
              <div className="text-5xl font-bold text-gray-800 mb-3">{teamBScore}</div>
              <button
                onClick={() => onScore('B')}
                disabled={!!winner}
                className="w-full py-3 bg-gradient-to-r from-green-400 to-emerald-400 text-white font-bold rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                B队得分
              </button>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500 mb-4">
            {state.extendMatch ? '加分模式' : '不加分'} · {state.matchPoint}分制
          </div>
        </div>

        {winner && (
          <div className="bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-3xl p-6 text-center mb-4 shadow-lg">
            <div className="text-lg font-bold mb-2">比赛结束</div>
            <div className="text-3xl font-bold">
              {winner === 'A' ? 'A队' : 'B队'} 获胜！
            </div>
            <div className="text-xl mt-2">
              {teamAScore} : {teamBScore}
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={onRestart}
                className="flex-1 py-3 bg-white text-green-500 font-bold rounded-xl hover:bg-gray-100 transition-colors"
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
                    <th className="py-2 text-center">A队</th>
                    <th className="py-2 text-center">B队</th>
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
