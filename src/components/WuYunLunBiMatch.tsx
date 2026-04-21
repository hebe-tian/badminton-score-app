import { useState, useEffect, type ReactNode } from 'react';
import type { WuYunLunBiMatchState, RotationInfo } from '../types';
import { detectWuYunRotationThreshold } from '../utils/scoring';

interface WuYunLunBiMatchProps {
  state: WuYunLunBiMatchState;
  onScore: (scoringTeam: 'A' | 'B') => void;
  onConfirmRotation: (info: RotationInfo) => void;
  onRestart: () => void;
  onBack: () => void;
}

export default function WuYunLunBiMatch({
  state,
  onScore,
  onConfirmRotation,
  onRestart,
  onBack,
}: WuYunLunBiMatchProps): ReactNode {
  const {
    teamA,
    teamB,
    teamAScore,
    teamBScore,
    currentServerPlayer,
    currentReceiverPlayer,
    teamACourtPositions,
    teamBCourtPositions,
    lastRotationScore,
    winner
  } = state;

  const [showRotationModal, setShowRotationModal] = useState(false);
  const [pendingRotation, setPendingRotation] = useState<RotationInfo | null>(null);

  useEffect(() => {
    if (!winner) {
      const maxScore = Math.max(teamAScore, teamBScore);
      // Only trigger rotation if we hit a 10-point threshold AND it's a new threshold
      if (maxScore > 0 && maxScore % 10 === 0 && maxScore !== lastRotationScore) {
        const info = detectWuYunRotationThreshold(teamAScore, teamBScore, teamA, teamB);
        if (info.isRotationPoint) {
          setPendingRotation(info);
          setShowRotationModal(true);
        }
      }
    }
  }, [teamAScore, teamBScore, winner, teamA, teamB, lastRotationScore]);

  const handleConfirmRotation = () => {
    if (pendingRotation) {
      onConfirmRotation(pendingRotation);
      setShowRotationModal(false);
      setPendingRotation(null);
    }
  };

  const handleScoreClick = (scoringTeam: 'A' | 'B') => {
    if (winner || showRotationModal) return;
    onScore(scoringTeam);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-rose-50 flex flex-col relative">
      {/* Rotation Modal */}
      {showRotationModal && pendingRotation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">换人提醒</h3>
            <div className="space-y-3 mb-6">
              {pendingRotation.benchedPlayers.map((p: { team: 'A' | 'B'; out: string; in: string }) => (
                <div key={`${p.team}-${p.out}`} className="text-center text-gray-600">
                  <span className="font-medium">{p.team}队：</span>
                  <span className="text-red-500">{p.out}</span> 下场 → <span className="text-green-500">{p.in}</span> 上场
                </div>
              ))}
            </div>
            <button
              onClick={handleConfirmRotation}
              className="w-full py-3 bg-pink-500 text-white font-bold rounded-xl hover:bg-pink-600 transition-colors"
            >
              确认换人
            </button>
          </div>
        </div>
      )}

      <header className="flex items-center p-4 bg-white bg-opacity-80 shadow-sm">
        <button onClick={onBack} className="p-2 text-gray-500 hover:text-pink-400 transition-colors">
          ←
        </button>
        <h1 className="text-lg font-bold text-gray-800 flex-1 text-center pr-8">五羽伦比</h1>
      </header>

      <div className="flex-1 flex flex-col p-4 max-w-lg mx-auto w-full">
        {/* Court Visualization */}
        <div className="bg-white bg-opacity-90 rounded-3xl shadow-lg p-4 mb-4">
          <div className="grid grid-cols-2 gap-2 text-center">
            {/* Team A Courts */}
            <div className={`p-3 rounded-xl border-2 ${teamACourtPositions.evenCourtPlayer === currentServerPlayer ? 'border-pink-400 bg-pink-50' : teamACourtPositions.evenCourtPlayer === currentReceiverPlayer ? 'border-blue-400 bg-blue-50' : 'border-gray-100'}`}>
              <div className="text-xs text-gray-500 mb-1">A双数区</div>
              <div className="font-bold text-gray-800">
                {teamACourtPositions.evenCourtPlayer}
                {teamACourtPositions.evenCourtPlayer === currentServerPlayer && <span className="ml-1 text-pink-500 text-xs">发</span>}
                {teamACourtPositions.evenCourtPlayer === currentReceiverPlayer && <span className="ml-1 text-blue-500 text-xs">接</span>}
              </div>
            </div>
            <div className={`p-3 rounded-xl border-2 ${teamACourtPositions.oddCourtPlayer === currentServerPlayer ? 'border-pink-400 bg-pink-50' : teamACourtPositions.oddCourtPlayer === currentReceiverPlayer ? 'border-blue-400 bg-blue-50' : 'border-gray-100'}`}>
              <div className="text-xs text-gray-500 mb-1">A单数区</div>
              <div className="font-bold text-gray-800">
                {teamACourtPositions.oddCourtPlayer}
                {teamACourtPositions.oddCourtPlayer === currentServerPlayer && <span className="ml-1 text-pink-500 text-xs">发</span>}
                {teamACourtPositions.oddCourtPlayer === currentReceiverPlayer && <span className="ml-1 text-blue-500 text-xs">接</span>}
              </div>
            </div>
            
            {/* Team B Courts */}
            <div className={`p-3 rounded-xl border-2 ${teamBCourtPositions.oddCourtPlayer === currentServerPlayer ? 'border-pink-400 bg-pink-50' : teamBCourtPositions.oddCourtPlayer === currentReceiverPlayer ? 'border-blue-400 bg-blue-50' : 'border-gray-100'}`}>
              <div className="text-xs text-gray-500 mb-1">B单数区</div>
              <div className="font-bold text-gray-800">
                {teamBCourtPositions.oddCourtPlayer}
                {teamBCourtPositions.oddCourtPlayer === currentServerPlayer && <span className="ml-1 text-pink-500 text-xs">发</span>}
                {teamBCourtPositions.oddCourtPlayer === currentReceiverPlayer && <span className="ml-1 text-blue-500 text-xs">接</span>}
              </div>
            </div>
            <div className={`p-3 rounded-xl border-2 ${teamBCourtPositions.evenCourtPlayer === currentServerPlayer ? 'border-pink-400 bg-pink-50' : teamBCourtPositions.evenCourtPlayer === currentReceiverPlayer ? 'border-blue-400 bg-blue-50' : 'border-gray-100'}`}>
              <div className="text-xs text-gray-500 mb-1">B双数区</div>
              <div className="font-bold text-gray-800">
                {teamBCourtPositions.evenCourtPlayer}
                {teamBCourtPositions.evenCourtPlayer === currentServerPlayer && <span className="ml-1 text-pink-500 text-xs">发</span>}
                {teamBCourtPositions.evenCourtPlayer === currentReceiverPlayer && <span className="ml-1 text-blue-500 text-xs">接</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white bg-opacity-90 rounded-3xl shadow-lg p-6 mb-4">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-center flex-1">
              <div className="text-sm font-medium mb-1 text-gray-600">A队</div>
              <div className="text-5xl font-bold text-gray-800 mb-3">{teamAScore}</div>
              <button
                onClick={() => handleScoreClick('A')}
                disabled={!!winner || showRotationModal}
                className="w-full py-3 bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                A队得分
              </button>
            </div>

            <div className="text-3xl font-bold text-gray-300">:</div>

            <div className="text-center flex-1">
              <div className="text-sm font-medium mb-1 text-gray-600">B队</div>
              <div className="text-5xl font-bold text-gray-800 mb-3">{teamBScore}</div>
              <button
                onClick={() => handleScoreClick('B')}
                disabled={!!winner || showRotationModal}
                className="w-full py-3 bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                B队得分
              </button>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500 mb-4">
            五羽伦比 · {state.totalPoints}分制
          </div>
        </div>

        {winner && (
          <div className="bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-3xl p-6 text-center mb-4 shadow-lg">
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
                className="flex-1 py-3 bg-white text-pink-500 font-bold rounded-xl hover:bg-gray-100 transition-colors"
              >
                重新开始
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
