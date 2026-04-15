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
} from './types';
import {
  isMatchFinished,
  isWuYunLunBiMatchFinished,
  getNextSinglesServer,
  getNextDoublesServer,
  getWuYunLunBiPlayerRotation,
} from './utils/scoring';

type AppView = 'mode-select' | 'singles-setup' | 'singles-match' | 'doubles-setup' | 'doubles-match' | 'wu-yun-lun-bi-setup' | 'wu-yun-lun-bi-match';

function App() {
  const [view, setView] = useState<AppView>('mode-select');

  const [singlesConfig, setSinglesConfig] = useState<SinglesMatchConfig>({
    mode: 'singles',
    matchPoint: 21,
    extendMatch: false,
    player1Name: '',
    player2Name: '',
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
    setDoublesState({
      ...doublesConfig,
      teamAScore: 0,
      teamBScore: 0,
      currentServerTeam: doublesConfig.firstServerTeam,
      currentServerPlayer: doublesConfig.firstServerPlayer,
      currentReceiverPlayer: doublesConfig.firstReceiverPlayer,
      isFinished: false,
      winner: null,
    });
    setDoublesHistory({ entries: [], matchMode: 'doubles' });
    setView('doubles-match');
  };

  const handleDoublesScore = (scoringTeam: 'A' | 'B') => {
    if (!doublesState) return;
    const newState = { ...doublesState };
    if (scoringTeam === 'A') newState.teamAScore += 1;
    else newState.teamBScore += 1;

    const nextServer = getNextDoublesServer(
      newState.currentServerTeam,
      newState.currentServerPlayer,
      newState.currentReceiverPlayer,
      scoringTeam,
      newState.teamA,
      newState.teamB
    );
    newState.currentServerTeam = nextServer.serverTeam;
    newState.currentServerPlayer = nextServer.serverPlayer;
    newState.currentReceiverPlayer = nextServer.receiverPlayer;

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
    const rotation = getWuYunLunBiPlayerRotation(0, 0, wuYunLunBiConfig.teamA, wuYunLunBiConfig.teamB);
    setWuYunLunBiState({
      ...wuYunLunBiConfig,
      teamAScore: 0,
      teamBScore: 0,
      currentServerTeam: wuYunLunBiConfig.firstServerTeam,
      currentServerPlayer: wuYunLunBiConfig.firstServerPlayer,
      currentReceiverPlayer: wuYunLunBiConfig.firstReceiverPlayer,
      currentPlayerIndices: rotation.currentPlayerIndices,
      isFinished: false,
      winner: null,
    });
    setWuYunLunBiHistory({ entries: [], matchMode: 'wu-yun-lun-bi' });
    setView('wu-yun-lun-bi-match');
  };

  const handleWuYunLunBiScore = (scoringTeam: 'A' | 'B') => {
    if (!wuYunLunBiState) return;
    const newState = { ...wuYunLunBiState };
    if (scoringTeam === 'A') newState.teamAScore += 1;
    else newState.teamBScore += 1;

    const rotation = getWuYunLunBiPlayerRotation(newState.teamAScore, newState.teamBScore, newState.teamA, newState.teamB);
    newState.currentServerTeam = rotation.nextServerTeam;
    newState.currentServerPlayer = rotation.nextServerPlayer;
    newState.currentReceiverPlayer = rotation.nextReceiverPlayer;
    newState.currentPlayerIndices = rotation.currentPlayerIndices;

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
      setDoublesState({
        ...doublesConfig,
        teamAScore: 0,
        teamBScore: 0,
        currentServerTeam: doublesConfig.firstServerTeam,
        currentServerPlayer: doublesConfig.firstServerPlayer,
        currentReceiverPlayer: doublesConfig.firstReceiverPlayer,
        isFinished: false,
        winner: null,
      });
      setDoublesHistory({ entries: [], matchMode: 'doubles' });
    } else if (view === 'wu-yun-lun-bi-match') {
      const rotation = getWuYunLunBiPlayerRotation(0, 0, wuYunLunBiConfig.teamA, wuYunLunBiConfig.teamB);
      setWuYunLunBiState({
        ...wuYunLunBiConfig,
        teamAScore: 0,
        teamBScore: 0,
        currentServerTeam: wuYunLunBiConfig.firstServerTeam,
        currentServerPlayer: wuYunLunBiConfig.firstServerPlayer,
        currentReceiverPlayer: wuYunLunBiConfig.firstReceiverPlayer,
        currentPlayerIndices: rotation.currentPlayerIndices,
        isFinished: false,
        winner: null,
      });
      setWuYunLunBiHistory({ entries: [], matchMode: 'wu-yun-lun-bi' });
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
          scoreHistory={wuYunLunBiHistory}
          onScore={handleWuYunLunBiScore}
          onRestart={handleRestart}
          onBack={handleBack}
        />
      )}
    </div>
  );
}

export default App;
