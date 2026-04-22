import { useState, useEffect, type ReactNode } from 'react';
import type { DoublesMatchState, ScoreHistory } from '../types';
import ScoreRecordModal from './ScoreRecordModal';

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
        <span className="text-green-600 font-bold">
          {name}<span className="ml-1 text-xs">发</span>
        </span>
      );
    }
    if (isReceiver) {
      return (
        <span className="text-blue-600 font-bold">
          {name}<span className="ml-1 text-xs">接</span>
        </span>
      );
    }
    return <span className="text-gray-800">{name}</span>;
  };

  // 判断球员是否为发球方或接发球方，返回相应的样式类
  const getCourtBoxClass = (playerId: string, team: 'A' | 'B') => {
    const isServer = playerId === currentServerPlayer && currentServerTeam === team;
    const isReceiver = playerId === currentReceiverPlayer && currentServerTeam !== team;
    
    if (isServer) {
      return 'p-3 rounded-xl border-2 border-green-400 bg-green-50 shadow-md shadow-green-200';
    }
    if (isReceiver) {
      return 'p-3 rounded-xl border-2 border-blue-400 bg-blue-50 shadow-md shadow-blue-200';
    }
    return 'p-3 rounded-xl border-2 border-gray-100';
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
              发球方: {getPlayerDisplayName(currentServerPlayer)}
            </span>
          </div>

          {/* 场地布局：A队左双右单，B队左单右双（面对面站位） */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-4 text-center mb-6">
            {/* A队双数区 */}
            <div className={getCourtBoxClass(teamAPositions.evenCourtPlayer, 'A')}>
              <div className="text-xs text-gray-500 mb-1">A双数区</div>
              <div className="font-bold">
                {getPlayerWithLabel(teamAPositions.evenCourtPlayer, 'A')}
              </div>
            </div>

            {/* A队单数区 */}
            <div className={getCourtBoxClass(teamAPositions.oddCourtPlayer, 'A')}>
              <div className="text-xs text-gray-500 mb-1">A单数区</div>
              <div className="font-bold">
                {getPlayerWithLabel(teamAPositions.oddCourtPlayer, 'A')}
              </div>
            </div>

            {/* B队单数区 */}
            <div className={getCourtBoxClass(teamBPositions.oddCourtPlayer, 'B')}>
              <div className="text-xs text-gray-500 mb-1">B单数区</div>
              <div className="font-bold">
                {getPlayerWithLabel(teamBPositions.oddCourtPlayer, 'B')}
              </div>
            </div>

            {/* B队双数区 */}
            <div className={getCourtBoxClass(teamBPositions.evenCourtPlayer, 'B')}>
              <div className="text-xs text-gray-500 mb-1">B双数区</div>
              <div className="font-bold">
                {getPlayerWithLabel(teamBPositions.evenCourtPlayer, 'B')}
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

        {winner && showRecord && (
          <ScoreRecordModal 
            entries={scoreHistory.entries}
            mode="doubles"
            onClose={() => setShowRecord(false)}
            onBackToHome={handleBackToHome}
            themeColor="green"
          />
        )}
      </div>
    </div>
  );
}
