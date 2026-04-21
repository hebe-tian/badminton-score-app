import { useState } from 'react';
import ModeSelect from './components/ModeSelect';
import SinglesSetup from './components/SinglesSetup';
import SinglesMatch from './components/SinglesMatch';
import DoublesSetup from './components/DoublesSetup';
import DoublesMatch from './components/DoublesMatch';
import WuYunLunBiSetup from './components/WuYunLunBiSetup';
import WuYunLunBiMatch from './components/WuYunLunBiMatch';
import type {
  SinglesMatchConfig,
  SinglesMatchState,
  DoublesMatchConfig,
  DoublesMatchState,
  WuYunLunBiMatchConfig,
  WuYunLunBiMatchState,
  ScoreHistory,
  RotationInfo,
} from './types';
import {
  isMatchFinished,
  isWuYunLunBiMatchFinished,
  getNextSinglesServer,
  getNextDoublesServer,
  handleWuYunServerScores,
  handleWuYunReceiverScores,
  applyWuYunRotation,
} from './utils/scoring';

type AppView = 'mode-select' | 'singles-setup' | 'singles-match' | 'doubles-setup' | 'doubles-match' | 'wu-yun-lun-bi-setup' | 'wu-yun-lun-bi-match';

function App() {
  const [view, setView] = useState<AppView>('mode-select');

  const [singlesConfig, setSinglesConfig] = useState<SinglesMatchConfig>({
    mode: 'singles',
    matchPoint: 21,
    extendMatch: false,
    player1Name: 'A',
    player2Name: 'B',
    firstServer: 1,
  });

  const [singlesState, setSinglesState] = useState<SinglesMatchState | null>(null);
  const [singlesHistory, setSinglesHistory] = useState<ScoreHistory>({ entries: [], matchMode: 'singles' });

  const [doublesConfig, setDoublesConfig] = useState<DoublesMatchConfig>({
    mode: 'doubles',
    matchPoint: 21,
    extendMatch: true,
    teamA: { id: 'A', player1Name: '', player2Name: '' },
    teamB: { id: 'B', player1Name: '', player2Name: '' },
    firstServerTeam: 'A',
    firstServerPlayer: '',
    firstReceiverPlayer: '',
  });

  const [doublesState, setDoublesState] = useState<DoublesMatchState | null>(null);
  const [doublesHistory, setDoublesHistory] = useState<ScoreHistory>({ entries: [], matchMode: 'doubles' });

  const [wuYunLunBiConfig, setWuYunLunBiConfig] = useState<WuYunLunBiMatchConfig>({
    mode: 'wu-yun-lun-bi',
    totalPoints: 50,
    teamA: { id: 'A', players: ['', '', '', '', ''] },
    teamB: { id: 'B', players: ['', '', '', '', ''] },
    firstServerTeam: 'A',
    firstServerPlayer: '',
    firstReceiverPlayer: '',
  });

  const [wuYunLunBiState, setWuYunLunBiState] = useState<WuYunLunBiMatchState | null>(null);
  const [wuYunLunBiHistory, setWuYunLunBiHistory] = useState<ScoreHistory>({ entries: [], matchMode: 'wu-yun-lun-bi' });

  const handleSelectMode = (mode: 'singles' | 'doubles' | 'wu-yun-lun-bi') => {
    if (mode === 'singles') setView('singles-setup');
    else if (mode === 'doubles') setView('doubles-setup');
    else setView('wu-yun-lun-bi-setup');
  };

  const handleSinglesStart = () => {
    setSinglesState({
      ...singlesConfig,
      player1Score: 0,
      player2Score: 0,
      currentServer: singlesConfig.firstServer,
      isFinished: false,
      winner: null,
    });
    setSinglesHistory({ entries: [], matchMode: 'singles' });
    setView('singles-match');
  };

  const handleSinglesScore = (scoringPlayer: 1 | 2) => {
    if (!singlesState) return;
    const newState = { ...singlesState };
    if (scoringPlayer === 1) newState.player1Score += 1;
    else newState.player2Score += 1;

    newState.currentServer = getNextSinglesServer(newState.currentServer, scoringPlayer);

    const result = isMatchFinished(newState.player1Score, newState.player2Score, newState.matchPoint, newState.extendMatch);
    if (result.finished && (result.winner === '1' || result.winner === '2')) {
      newState.isFinished = true;
      newState.winner = result.winner === '1' ? 1 : 2;
      singlesHistory.matchResult = {
        winner: result.winner,
        finalScore: { teamA: newState.player1Score, teamB: newState.player2Score }
      };
    }

    setSinglesState(newState);
  };

  const handleDoublesStart = () => {
    // 根据发球球员标识符自动推断发球队（A1/A2属于A队，B1/B2属于B队）
    const firstServerTeam = doublesConfig.firstServerPlayer?.startsWith('A') ? 'A' : 'B';
    
    // 根据首发球员设置初始位置
    // 规则：发球球员和接发球球员都在各自队伍的双数区
    // A队布局：左侧双数区，右侧单数区
    // B队布局：左侧单数区，右侧双数区（与A队相反）
    const serverPlayer = doublesConfig.firstServerPlayer;
    const receiverPlayer = doublesConfig.firstReceiverPlayer;
    
    let teamAPositions: { evenCourtPlayer: string; oddCourtPlayer: string };
    let teamBPositions: { evenCourtPlayer: string; oddCourtPlayer: string };
    
    if (firstServerTeam === 'A') {
      // A队发球：发球球员在双数区，队友在单数区
      teamAPositions = {
        evenCourtPlayer: serverPlayer,
        oddCourtPlayer: serverPlayer === 'A1' ? 'A2' : 'A1',
      };
      // B队接发球：接发球球员在双数区，队友在单数区
      teamBPositions = {
        evenCourtPlayer: receiverPlayer,
        oddCourtPlayer: receiverPlayer === 'B1' ? 'B2' : 'B1',
      };
    } else {
      // B队发球：发球球员在双数区，队友在单数区
      teamBPositions = {
        evenCourtPlayer: serverPlayer,
        oddCourtPlayer: serverPlayer === 'B1' ? 'B2' : 'B1',
      };
      // A队接发球：接发球球员在双数区，队友在单数区
      teamAPositions = {
        evenCourtPlayer: receiverPlayer,
        oddCourtPlayer: receiverPlayer === 'A1' ? 'A2' : 'A1',
      };
    }
    
    setDoublesState({
      ...doublesConfig,
      teamAScore: 0,
      teamBScore: 0,
      currentServerTeam: firstServerTeam,
      currentServerPlayer: doublesConfig.firstServerPlayer,
      currentReceiverPlayer: doublesConfig.firstReceiverPlayer,
      teamAPositions,
      teamBPositions,
      isFinished: false,
      winner: null,
    });
    setDoublesHistory({ entries: [], matchMode: 'doubles' });
    setView('doubles-match');
  };

  const handleDoublesScore = (scoringTeam: 'A' | 'B') => {
    if (!doublesState) return;
    
    // 先加分
    const newState = { ...doublesState };
    if (scoringTeam === 'A') newState.teamAScore += 1;
    else newState.teamBScore += 1;

    // 计算下一个发球状态（包含位置更新）
    const nextServer = getNextDoublesServer(newState, scoringTeam);
    
    newState.currentServerTeam = nextServer.serverTeam;
    newState.currentServerPlayer = nextServer.serverPlayer;
    newState.currentReceiverPlayer = nextServer.receiverPlayer;
    newState.teamAPositions = nextServer.teamAPositions;
    newState.teamBPositions = nextServer.teamBPositions;

    // 检查比赛是否结束
    const result = isMatchFinished(newState.teamAScore, newState.teamBScore, newState.matchPoint, newState.extendMatch);
    if (result.finished) {
      newState.isFinished = true;
      newState.winner = result.winner as 'A' | 'B';
      doublesHistory.matchResult = {
        winner: result.winner as 'A' | 'B',
        finalScore: { teamA: newState.teamAScore, teamB: newState.teamBScore }
      };
    }

    setDoublesState(newState);
  };

  const handleWuYunLunBiStart = () => {
    const serverPlayer = wuYunLunBiConfig.firstServerPlayer;
    const receiverPlayer = wuYunLunBiConfig.firstReceiverPlayer;
    
    // Determine server team from the selected player
    const isServerTeamA = serverPlayer === wuYunLunBiConfig.teamA.players[0] || serverPlayer === wuYunLunBiConfig.teamA.players[1];
    const serverTeam = isServerTeamA ? 'A' : 'B';

    // Initial positions: Server and Receiver in Even courts, their partners in Odd courts
    const initialTeamACourts = {
      evenCourtPlayer: isServerTeamA ? serverPlayer : receiverPlayer,
      oddCourtPlayer: isServerTeamA 
        ? (serverPlayer === wuYunLunBiConfig.teamA.players[0] ? wuYunLunBiConfig.teamA.players[1] : wuYunLunBiConfig.teamA.players[0])
        : (receiverPlayer === wuYunLunBiConfig.teamA.players[0] ? wuYunLunBiConfig.teamA.players[1] : wuYunLunBiConfig.teamA.players[0]),
    };

    const initialTeamBCourts = {
      evenCourtPlayer: !isServerTeamA ? serverPlayer : receiverPlayer,
      oddCourtPlayer: !isServerTeamA
        ? (serverPlayer === wuYunLunBiConfig.teamB.players[0] ? wuYunLunBiConfig.teamB.players[1] : wuYunLunBiConfig.teamB.players[0])
        : (receiverPlayer === wuYunLunBiConfig.teamB.players[0] ? wuYunLunBiConfig.teamB.players[1] : wuYunLunBiConfig.teamB.players[0]),
    };

    // Initial indices based on names
    const getIdx = (team: 'A' | 'B', name: string) => {
      const players = team === 'A' ? wuYunLunBiConfig.teamA.players : wuYunLunBiConfig.teamB.players;
      return players.indexOf(name);
    };

    setWuYunLunBiState({
      ...wuYunLunBiConfig,
      teamAScore: 0,
      teamBScore: 0,
      currentServerTeam: serverTeam,
      currentServerPlayer: serverPlayer,
      currentReceiverPlayer: receiverPlayer,
      teamACourtPositions: initialTeamACourts,
      teamBCourtPositions: initialTeamBCourts,
      currentPlayerIndices: {
        teamA: [getIdx('A', initialTeamACourts.evenCourtPlayer), getIdx('A', initialTeamACourts.oddCourtPlayer)],
        teamB: [getIdx('B', initialTeamBCourts.evenCourtPlayer), getIdx('B', initialTeamBCourts.oddCourtPlayer)],
      },
      lastRotationScore: 0,
      isFinished: false,
      winner: null,
    });
    setWuYunLunBiHistory({ entries: [], matchMode: 'wu-yun-lun-bi' });
    setView('wu-yun-lun-bi-match');
  };

  const handleWuYunLunBiScore = (scoringTeam: 'A' | 'B') => {
    if (!wuYunLunBiState) return;
    
    // 1. Handle Scoring Logic
    let newState: WuYunLunBiMatchState;
    if (scoringTeam === wuYunLunBiState.currentServerTeam) {
      newState = handleWuYunServerScores(wuYunLunBiState);
    } else {
      newState = handleWuYunReceiverScores(wuYunLunBiState);
    }

    // 2. Check for Match End
    const result = isWuYunLunBiMatchFinished(newState.teamAScore, newState.teamBScore, newState.totalPoints);
    if (result.finished) {
      newState.isFinished = true;
      newState.winner = result.winner as 'A' | 'B';
      wuYunLunBiHistory.matchResult = {
        winner: result.winner as 'A' | 'B',
        finalScore: { teamA: newState.teamAScore, teamB: newState.teamBScore }
      };
    }

    setWuYunLunBiState(newState);
  };

  const handleWuYunLunBiRotationConfirm = (info: RotationInfo) => {
    if (!wuYunLunBiState) return;
    const newState = applyWuYunRotation(wuYunLunBiState, info);
    setWuYunLunBiState(newState);
  };

  const handleBack = () => {
    setView('mode-select');
  };

  const handleRestart = () => {
    if (view === 'singles-match') {
      setSinglesState({
        ...singlesConfig,
        player1Score: 0,
        player2Score: 0,
        currentServer: singlesConfig.firstServer,
        isFinished: false,
        winner: null,
      });
      setSinglesHistory({ entries: [], matchMode: 'singles' });
    } else if (view === 'doubles-match') {
      const firstServerTeam = doublesConfig.firstServerPlayer?.startsWith('A') ? 'A' : 'B';
      
      // 重新计算初始位置（与 handleDoublesStart 相同逻辑）
      const serverPlayer = doublesConfig.firstServerPlayer;
      const receiverPlayer = doublesConfig.firstReceiverPlayer;
      
      let teamAPositions: { evenCourtPlayer: string; oddCourtPlayer: string };
      let teamBPositions: { evenCourtPlayer: string; oddCourtPlayer: string };
      
      if (firstServerTeam === 'A') {
        teamAPositions = {
          evenCourtPlayer: serverPlayer,
          oddCourtPlayer: serverPlayer === 'A1' ? 'A2' : 'A1',
        };
        teamBPositions = {
          evenCourtPlayer: receiverPlayer,
          oddCourtPlayer: receiverPlayer === 'B1' ? 'B2' : 'B1',
        };
      } else {
        teamBPositions = {
          evenCourtPlayer: serverPlayer,
          oddCourtPlayer: serverPlayer === 'B1' ? 'B2' : 'B1',
        };
        teamAPositions = {
          evenCourtPlayer: receiverPlayer,
          oddCourtPlayer: receiverPlayer === 'A1' ? 'A2' : 'A1',
        };
      }
      
      setDoublesState({
        ...doublesConfig,
        teamAScore: 0,
        teamBScore: 0,
        currentServerTeam: firstServerTeam,
        currentServerPlayer: doublesConfig.firstServerPlayer,
        currentReceiverPlayer: doublesConfig.firstReceiverPlayer,
        teamAPositions,
        teamBPositions,
        isFinished: false,
        winner: null,
      });
      setDoublesHistory({ entries: [], matchMode: 'doubles' });
    } else if (view === 'wu-yun-lun-bi-match') {
      handleWuYunLunBiStart();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {view === 'mode-select' && (
        <ModeSelect onSelectMode={handleSelectMode} />
      )}

      {view === 'singles-setup' && (
        <SinglesSetup
          config={singlesConfig}
          onConfigChange={(config) => setSinglesConfig({ ...singlesConfig, ...config })}
          onStart={handleSinglesStart}
          onBack={handleBack}
        />
      )}

      {view === 'singles-match' && singlesState && (
        <SinglesMatch
          state={singlesState}
          scoreHistory={singlesHistory}
          onScore={handleSinglesScore}
          onRestart={handleRestart}
          onBack={handleBack}
        />
      )}

      {view === 'doubles-setup' && (
        <DoublesSetup
          config={doublesConfig}
          onConfigChange={(config) => setDoublesConfig({ ...doublesConfig, ...config })}
          onStart={handleDoublesStart}
          onBack={handleBack}
        />
      )}

      {view === 'doubles-match' && doublesState && (
        <DoublesMatch
          state={doublesState}
          scoreHistory={doublesHistory}
          onScore={handleDoublesScore}
          onRestart={handleRestart}
          onBack={handleBack}
        />
      )}

      {view === 'wu-yun-lun-bi-setup' && (
        <WuYunLunBiSetup
          config={wuYunLunBiConfig}
          onConfigChange={(config) => setWuYunLunBiConfig({ ...wuYunLunBiConfig, ...config })}
          onStart={handleWuYunLunBiStart}
          onBack={handleBack}
        />
      )}

      {view === 'wu-yun-lun-bi-match' && wuYunLunBiState && (
        <WuYunLunBiMatch
          state={wuYunLunBiState}
          onScore={handleWuYunLunBiScore}
          onConfirmRotation={handleWuYunLunBiRotationConfirm}
          onRestart={handleRestart}
          onBack={handleBack}
        />
      )}
    </div>
  );
}

export default App;
