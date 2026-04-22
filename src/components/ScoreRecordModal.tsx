import type { ReactNode } from 'react';
import type { ScoreHistoryEntry } from '../types';

interface ScoreRecordModalProps {
  entries: ScoreHistoryEntry[];
  mode: 'singles' | 'doubles' | 'wu-yun-lun-bi';
  onClose: () => void;
  onBackToHome?: () => void;
  themeColor?: string; // e.g., 'blue', 'green', 'pink'
}

export default function ScoreRecordModal({ 
  entries, 
  mode, 
  onClose,
  onBackToHome,
  themeColor = 'blue'
}: ScoreRecordModalProps): ReactNode {
  
  const getThemeClasses = () => {
    switch (themeColor) {
      case 'green': return 'from-green-400 to-emerald-400 text-green-500';
      case 'pink': return 'from-pink-400 to-rose-400 text-pink-500';
      default: return 'from-blue-400 to-cyan-400 text-blue-500';
    }
  };

  const getScorerDisplay = (entry: ScoreHistoryEntry) => {
    if (mode === 'singles') {
      return entry.scoringSide;
    }
    if (mode === 'doubles' && entry.scorers) {
      return entry.scorers.join('，');
    }
    if (mode === 'wu-yun-lun-bi' && entry.onCourtPlayers) {
      // For WuYunLunBi, we show the two players of the scoring team who were on court
      // The entry.scoringSide is 'A' or 'B'
      const players = entry.scoringSide === 'A' 
        ? entry.onCourtPlayers.teamA 
        : entry.onCourtPlayers.teamB;
      return players.join('，');
    }
    return entry.scoringSide;
  };

  // Ensure at least 8 rows
  const displayEntries = [...entries];
  while (displayEntries.length < 8) {
    displayEntries.push({
      sequenceNumber: displayEntries.length + 1,
      scoringSide: '',
      teamAScore: 0,
      teamBScore: 0,
      scorers: [],
      isEmpty: true
    } as any);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
        <div className={`p-4 bg-gradient-to-r ${getThemeClasses().split(' ').slice(0, 2).join(' ')} text-white`}>          
          <h3 className="text-lg font-bold text-center mb-3">得分记录</h3>
          <div className="flex text-sm font-medium opacity-90 border-t border-white/30 pt-3">
            <div className="w-[20%] text-center">序号</div>
            <div className="w-[40%] text-center">得分球员</div>
            <div className="w-[40%] text-center">队伍分数</div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 score-record-container">
          <table className="w-full text-sm border-collapse">
            <tbody>
              {displayEntries.map((entry, index) => (
                <tr key={index} className={`border-b border-gray-50 ${(entry as any).isEmpty ? 'h-10' : ''}`}>
                  <td className="py-3 w-[20%] text-center text-gray-400">{(entry as any).isEmpty ? '' : entry.sequenceNumber}</td>
                  <td className="py-3 w-[40%] text-center text-gray-800 font-medium">
                    {(entry as any).isEmpty ? '' : getScorerDisplay(entry)}
                  </td>
                  <td className="py-3 w-[40%] text-center text-gray-600">
                    {(entry as any).isEmpty ? '' : `A:${entry.teamAScore} | B:${entry.teamBScore}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="flex-1 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-100 transition-all"
            >
              返回主页
            </button>
          )}
          <button
            onClick={onClose}
            className={`flex-1 py-3 bg-gradient-to-r ${getThemeClasses().split(' ').slice(0, 2).join(' ')} text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all`}
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}
