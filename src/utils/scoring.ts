import type {
  DoublesMatchState,
  TeamPositions,
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
  _currentServer: 1 | 2,
  scoringPlayer: 1 | 2
): 1 | 2 {
  return scoringPlayer;
}

/**
 * 根据发球球员确定接发球球员
 * 规则3：A队单数区发球 → B队单数区接发；A队双数区发球 → B队双数区接发
 */
function getReceiverByServer(
  serverPlayer: string,
  serverTeam: 'A' | 'B',
  teamAPositions: TeamPositions,
  teamBPositions: TeamPositions
): string {
  // 确定发球球员在哪个区域
  const isServerInEvenCourt = teamAPositions.evenCourtPlayer === serverPlayer || 
                               teamBPositions.evenCourtPlayer === serverPlayer;
  
  // 接发球方是另一方
  const receiverTeamPositions = serverTeam === 'A' ? teamBPositions : teamAPositions;
  
  // 一一对应：双数区对双数区，单数区对单数区
  return isServerInEvenCourt 
    ? receiverTeamPositions.evenCourtPlayer 
    : receiverTeamPositions.oddCourtPlayer;
}

/**
 * 双打发球轮换逻辑（完全按照设计文档实现）
 * 
 * 规则1 - 发球方得分：
 *   - 加分
 *   - 发球方两人交换位置（单数区↔双数区）
 *   - 同一人继续发球
 *   - 接发球方位置不变
 * 
 * 规则2 - 发球方失分：
 *   - 加分
 *   - 双方位置都不变
 *   - 转换发球权
 *   - 新发球方按分数单双选择发球人（单数→单数区球员，双数→双数区球员）
 * 
 * 规则3 - 接发球确定：
 *   - A队单数区发球 → B队单数区接发
 *   - A队双数区发球 → B队双数区接发
 */
export function getNextDoublesServer(
  currentState: DoublesMatchState,
  scoringTeam: 'A' | 'B'
): {
  serverTeam: 'A' | 'B';
  serverPlayer: string;
  receiverPlayer: string;
  teamAPositions: TeamPositions;
  teamBPositions: TeamPositions;
} {
  const { currentServerTeam, currentServerPlayer, teamAPositions, teamBPositions } = currentState;
  const isScorer = currentServerTeam === scoringTeam;
  
  let newTeamAPositions = { ...teamAPositions };
  let newTeamBPositions = { ...teamBPositions };
  let nextServerTeam: 'A' | 'B';
  let nextServerPlayer: string;
  let nextReceiverPlayer: string;
  
  if (isScorer) {
    // 规则1：发球方得分
    // 发球方交换位置，同一人继续发球
    nextServerTeam = currentServerTeam;
    nextServerPlayer = currentServerPlayer;
    
    // 发球方交换位置
    if (currentServerTeam === 'A') {
      newTeamAPositions = {
        evenCourtPlayer: teamAPositions.oddCourtPlayer,
        oddCourtPlayer: teamAPositions.evenCourtPlayer,
      };
      // 接发球方（B队）位置不变
      newTeamBPositions = teamBPositions;
    } else {
      newTeamBPositions = {
        evenCourtPlayer: teamBPositions.oddCourtPlayer,
        oddCourtPlayer: teamBPositions.evenCourtPlayer,
      };
      // 接发球方（A队）位置不变
      newTeamAPositions = teamAPositions;
    }
    
    // 根据新的位置确定接发球球员
    nextReceiverPlayer = getReceiverByServer(nextServerPlayer, nextServerTeam, newTeamAPositions, newTeamBPositions);
  } else {
    // 规则2：发球方失分（接发球方得分）
    // 双方位置不变，转换发球权
    nextServerTeam = scoringTeam;
    
    // 位置都不变
    newTeamAPositions = teamAPositions;
    newTeamBPositions = teamBPositions;
    
    // 新发球方按分数单双选择发球人
    const scoringTeamScore = scoringTeam === 'A' ? currentState.teamAScore : currentState.teamBScore;
    const scoringTeamPositions = scoringTeam === 'A' ? teamAPositions : teamBPositions;
    
    // 单数分→单数区球员发球，双数分→双数区球员发球
    if (scoringTeamScore % 2 === 1) {
      nextServerPlayer = scoringTeamPositions.oddCourtPlayer;
    } else {
      nextServerPlayer = scoringTeamPositions.evenCourtPlayer;
    }
    
    // 根据新发球人位置确定接发球人
    nextReceiverPlayer = getReceiverByServer(nextServerPlayer, nextServerTeam, newTeamAPositions, newTeamBPositions);
  }
  
  return {
    serverTeam: nextServerTeam,
    serverPlayer: nextServerPlayer,
    receiverPlayer: nextReceiverPlayer,
    teamAPositions: newTeamAPositions,
    teamBPositions: newTeamBPositions,
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

  const serverPlayerIndex = currentPlayerIndices[serverTeam === 'A' ? 'teamA' : 'teamB'][0];
  const receiverTeam = serverTeam === 'A' ? 'B' : 'A';
  const receiverPlayerIndex = currentPlayerIndices[receiverTeam === 'A' ? 'teamA' : 'teamB'][0];

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
  _totalPoints: number
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
