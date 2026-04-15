import type {
  DoublesTeam,
  WuYunLunBiTeam,
  ScoreHistoryEntry
} from '../types';

export interface MatchFinishedResult {
  finished: boolean;
  winner: 'A' | 'B' | '1' | '2' | null;
}

export function isMatchFinished(
  score1: number,
  score2: number,
  matchPoint: number,
  extendMatch: boolean
): MatchFinishedResult {
  if (!extendMatch) {
    if (score1 >= matchPoint) return { finished: true, winner: '1' };
    if (score2 >= matchPoint) return { finished: true, winner: '2' };
  } else {
    if (score1 >= matchPoint && score1 - score2 >= 2) {
      return { finished: true, winner: '1' };
    }
    if (score2 >= matchPoint && score2 - score1 >= 2) {
      return { finished: true, winner: '2' };
    }
  }
  return { finished: false, winner: null };
}

export function isWuYunLunBiMatchFinished(
  scoreA: number,
  scoreB: number,
  totalPoints: number
): MatchFinishedResult {
  if (scoreA >= totalPoints) return { finished: true, winner: 'A' };
  if (scoreB >= totalPoints) return { finished: true, winner: 'B' };
  return { finished: false, winner: null };
}

export function getNextSinglesServer(
  currentServer: 1 | 2,
  scoringPlayer: 1 | 2
): 1 | 2 {
  return scoringPlayer;
}

export function getNextDoublesServer(
  currentServerTeam: 'A' | 'B',
  currentServerPlayer: string,
  currentReceiverPlayer: string,
  scoringTeam: 'A' | 'B',
  teamA: DoublesTeam,
  teamB: DoublesTeam
): { serverTeam: 'A' | 'B'; serverPlayer: string; receiverPlayer: string } {
  const nextServerTeam = scoringTeam;
  const scoringTeamData = scoringTeam === 'A' ? teamA : teamB;
  const otherTeam = scoringTeam === 'A' ? teamB : teamA;

  const nextServerPlayer = currentServerPlayer === scoringTeamData.player1Name
    ? scoringTeamData.player2Name
    : scoringTeamData.player1Name;

  const nextReceiverPlayer = currentReceiverPlayer === otherTeam.player1Name
    ? otherTeam.player2Name
    : otherTeam.player1Name;

  return {
    serverTeam: nextServerTeam,
    serverPlayer: nextServerPlayer,
    receiverPlayer: nextReceiverPlayer
  };
}

export function getWuYunLunBiPlayerRotation(
  scoreA: number,
  scoreB: number,
  teamA: WuYunLunBiTeam,
  teamB: WuYunLunBiTeam
): {
  currentPlayerIndices: { teamA: [number, number]; teamB: [number, number] };
  nextServerTeam: 'A' | 'B';
  nextServerPlayer: string;
  nextReceiverPlayer: string;
} {
  const maxScore = Math.max(scoreA, scoreB);
  const phase = Math.floor(maxScore / 10) % 5;

  const playerPairMap: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 0],
  ];

  const currentPlayerIndices: { teamA: [number, number]; teamB: [number, number] } = {
    teamA: playerPairMap[phase] as [number, number],
    teamB: playerPairMap[phase] as [number, number],
  };

  const scoreLeader = scoreA > scoreB ? 'A' : scoreB > scoreA ? 'B' : null;
  const serverTeam = scoreLeader || 'A';

  const serverPlayerIndex = currentPlayerIndices[serverTeam][0];
  const receiverTeam = serverTeam === 'A' ? 'B' : 'A';
  const receiverPlayerIndex = currentPlayerIndices[receiverTeam][0];

  return {
    currentPlayerIndices,
    nextServerTeam: serverTeam,
    nextServerPlayer: serverTeam === 'A' ? teamA.players[serverPlayerIndex] : teamB.players[serverPlayerIndex],
    nextReceiverPlayer: receiverTeam === 'A' ? teamA.players[receiverPlayerIndex] : teamB.players[receiverPlayerIndex],
  };
}

export function detectRotationThreshold(
  scoreA: number,
  scoreB: number,
  totalPoints: number
): { isRotationPoint: boolean; benchedPlayers: { team: 'A' | 'B'; out: string; in: string }[] } {
  const maxScore = Math.max(scoreA, scoreB);
  const currentPhase = Math.floor(maxScore / 10) % 5;
  const previousPhase = Math.floor((maxScore - 1) / 10) % 5;

  if (currentPhase === previousPhase) {
    return { isRotationPoint: false, benchedPlayers: [] };
  }

  const phaseToPlayers = [
    { out: ['1', '2'], in: ['2', '3'] },
    { out: ['2', '3'], in: ['3', '4'] },
    { out: ['3', '4'], in: ['4', '5'] },
    { out: ['4', '5'], in: ['5', '1'] },
    { out: ['5', '1'], in: ['1', '2'] },
  ];

  const benchInfo = phaseToPlayers[currentPhase];
  const benchedPlayers: { team: 'A' | 'B'; out: string; in: string }[] = [
    { team: 'A', out: benchInfo.out[0], in: benchInfo.in[0] },
    { team: 'B', out: benchInfo.out[1], in: benchInfo.in[1] },
  ];

  return { isRotationPoint: true, benchedPlayers };
}

export function addScoreHistoryEntry(
  history: ScoreHistoryEntry[],
  scoringSide: string,
  teamAScore: number,
  teamBScore: number
): ScoreHistoryEntry {
  const entry: ScoreHistoryEntry = {
    sequenceNumber: history.length + 1,
    scoringSide,
    teamAScore,
    teamBScore,
  };
  return entry;
}

export function getScoringSideDisplay(
  mode: 'singles' | 'doubles' | 'wu-yun-lun-bi',
  scoringTeam: 'A' | 'B',
  player1Name: string,
  player2Name: string,
  players?: [string, string, string, string, string]
): string {
  if (mode === 'singles') {
    return scoringTeam === 'A' ? player1Name : player2Name;
  }

  if (mode === 'doubles') {
    return `${player1Name} / ${player2Name}`;
  }

  if (mode === 'wu-yun-lun-bi' && players) {
    return `${players[0]} / ${players[1]}`;
  }

  return scoringTeam;
}
