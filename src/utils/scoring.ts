import type {
  DoublesMatchState,
  TeamPositions,
  WuYunLunBiTeam,
  WuYunLunBiMatchState,
  CourtPositions,
  ScoreHistoryEntry
} from '../types';

export interface MatchFinishedResult {
  finished: boolean;
  winner: 'A' | 'B' | '1' | '2' | null;
}

export interface RotationInfo {
  isRotationPoint: boolean;
  benchedPlayers: Array<{
    team: 'A' | 'B';
    out: string;
    in: string;
  }>;
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

// --- Helper Functions for Court Positioning ---

function swapCourts(positions: CourtPositions): CourtPositions {
  return {
    evenCourtPlayer: positions.oddCourtPlayer,
    oddCourtPlayer: positions.evenCourtPlayer,
  };
}

function getReceiverByServerForWuYun(
  serverPlayer: string,
  serverTeam: 'A' | 'B',
  teamACourts: CourtPositions,
  teamBCourts: CourtPositions
): string {
  const serverCourts = serverTeam === 'A' ? teamACourts : teamBCourts;
  const isServerInEvenCourt = serverCourts.evenCourtPlayer === serverPlayer;
  
  const receiverCourts = serverTeam === 'A' ? teamBCourts : teamACourts;
  
  return isServerInEvenCourt
    ? receiverCourts.evenCourtPlayer
    : receiverCourts.oddCourtPlayer;
}

// --- WuYunLunBi Scoring Logic ---

export function handleWuYunServerScores(state: WuYunLunBiMatchState): WuYunLunBiMatchState {
  const scoringTeam = state.currentServerTeam;
  const newScore = scoringTeam === 'A' ? state.teamAScore + 1 : state.teamBScore + 1;
  
  let newTeamACourts = state.teamACourtPositions;
  let newTeamBCourts = state.teamBCourtPositions;

  // 1. Server team swaps courts
  if (scoringTeam === 'A') {
    newTeamACourts = swapCourts(state.teamACourtPositions);
  } else {
    newTeamBCourts = swapCourts(state.teamBCourtPositions);
  }

  // 2. Same server continues, determine new receiver
  const nextReceiver = getReceiverByServerForWuYun(
    state.currentServerPlayer,
    scoringTeam,
    newTeamACourts,
    newTeamBCourts
  );

  return {
    ...state,
    teamAScore: scoringTeam === 'A' ? newScore : state.teamAScore,
    teamBScore: scoringTeam === 'B' ? newScore : state.teamBScore,
    teamACourtPositions: newTeamACourts,
    teamBCourtPositions: newTeamBCourts,
    currentReceiverPlayer: nextReceiver,
  };
}

export function handleWuYunReceiverScores(state: WuYunLunBiMatchState): WuYunLunBiMatchState {
  const receivingTeam = state.currentServerTeam === 'A' ? 'B' : 'A';
  const newScore = receivingTeam === 'A' ? state.teamAScore + 1 : state.teamBScore + 1;
  
  // 1. Positions stay the same
  // 2. Serve transfers to receiving team
  // 3. New server based on parity of new score
  const scoringTeamPositions = receivingTeam === 'A' ? state.teamACourtPositions : state.teamBCourtPositions;
  
  const nextServerPlayer = newScore % 2 === 1
    ? scoringTeamPositions.oddCourtPlayer
    : scoringTeamPositions.evenCourtPlayer;

  const nextReceiver = getReceiverByServerForWuYun(
    nextServerPlayer,
    receivingTeam,
    state.teamACourtPositions,
    state.teamBCourtPositions
  );

  return {
    ...state,
    teamAScore: receivingTeam === 'A' ? newScore : state.teamAScore,
    teamBScore: receivingTeam === 'B' ? newScore : state.teamBScore,
    currentServerTeam: receivingTeam,
    currentServerPlayer: nextServerPlayer,
    currentReceiverPlayer: nextReceiver,
  };
}

export function applyWuYunRotation(
  state: WuYunLunBiMatchState,
  rotationInfo: RotationInfo
): WuYunLunBiMatchState {
  const aRotation = rotationInfo.benchedPlayers.find(p => p.team === 'A');
  const bRotation = rotationInfo.benchedPlayers.find(p => p.team === 'B');

  // Helper function to calculate new indices with proper court positioning
  // Rule: New player goes to even court, remaining player goes to odd court
  const getNewIndicesWithCourtPositioning = (
    currentIndices: [number, number], 
    teamPlayers: string[], 
    outName: string, 
    inName: string
  ): [number, number] => {
    const outIndex = currentIndices.findIndex(idx => teamPlayers[idx] === outName);
    const inIndex = teamPlayers.indexOf(inName);
    
    if (outIndex === -1 || inIndex === -1) return currentIndices; // Fallback

    // Find the remaining player (the one not going out)
    const remainingIndex = currentIndices.find(idx => teamPlayers[idx] !== outName);
    if (remainingIndex === undefined) return currentIndices;

    // New player goes to even court (index 0), remaining player goes to odd court (index 1)
    return [inIndex, remainingIndex];
  };

  let newTeamAIndices = state.currentPlayerIndices.teamA;
  let newTeamBIndices = state.currentPlayerIndices.teamB;

  if (aRotation) {
    newTeamAIndices = getNewIndicesWithCourtPositioning(newTeamAIndices, state.teamA.players, aRotation.out, aRotation.in);
  }
  if (bRotation) {
    newTeamBIndices = getNewIndicesWithCourtPositioning(newTeamBIndices, state.teamB.players, bRotation.out, bRotation.in);
  }

  // Reset positions: New players -> Even, Remaining -> Odd
  const newTeamACourts: CourtPositions = {
    evenCourtPlayer: state.teamA.players[newTeamAIndices[0]], // Index 0 = new player in even court
    oddCourtPlayer: state.teamA.players[newTeamAIndices[1]],  // Index 1 = remaining player in odd court
  };

  const newTeamBCourts: CourtPositions = {
    evenCourtPlayer: state.teamB.players[newTeamBIndices[0]], // Index 0 = new player in even court
    oddCourtPlayer: state.teamB.players[newTeamBIndices[1]],  // Index 1 = remaining player in odd court
  };

  // Determine serve: Leading team's new player (in even court) serves
  const leadingTeam = state.teamAScore > state.teamBScore ? 'A' : 'B';
  const newServerPlayer = leadingTeam === 'A' ? newTeamACourts.evenCourtPlayer : newTeamBCourts.evenCourtPlayer;

  // Use helper function to correctly determine receiver based on server's court position
  const newReceiverPlayer = getReceiverByServerForWuYun(
    newServerPlayer,
    leadingTeam,
    newTeamACourts,
    newTeamBCourts
  );

  return {
    ...state,
    currentPlayerIndices: {
      teamA: newTeamAIndices,
      teamB: newTeamBIndices,
    },
    teamACourtPositions: newTeamACourts,
    teamBCourtPositions: newTeamBCourts,
    currentServerTeam: leadingTeam,
    currentServerPlayer: newServerPlayer,
    currentReceiverPlayer: newReceiverPlayer,
    lastRotationScore: Math.max(state.teamAScore, state.teamBScore), // Update to prevent duplicate rotation prompts
  };
}

export function detectWuYunRotationThreshold(
  scoreA: number,
  scoreB: number,
  teamA: WuYunLunBiTeam,
  teamB: WuYunLunBiTeam
): RotationInfo {
  const maxScore = Math.max(scoreA, scoreB);
  
  if (maxScore === 0 || maxScore % 10 !== 0) {
    return { isRotationPoint: false, benchedPlayers: [] };
  }

  const phase = (Math.floor(maxScore / 10) - 1) % 5;
  
  // Rules: 
  // 0 (10pts): 1->3 (idx 0->2)
  // 1 (20pts): 2->4 (idx 1->3)
  // 2 (30pts): 3->5 (idx 2->4)
  // 3 (40pts): 4->1 (idx 3->0)
  // 4 (50pts): 5->2 (idx 4->1)
  const rules = [
    { outIdx: 0, inIdx: 2 },
    { outIdx: 1, inIdx: 3 },
    { outIdx: 2, inIdx: 4 },
    { outIdx: 3, inIdx: 0 },
    { outIdx: 4, inIdx: 1 },
  ];

  const rule = rules[phase];
  
  return {
    isRotationPoint: true,
    benchedPlayers: [
      { team: 'A', out: teamA.players[rule.outIdx], in: teamA.players[rule.inIdx] },
      { team: 'B', out: teamB.players[rule.outIdx], in: teamB.players[rule.inIdx] },
    ]
  };
}

// --- Legacy/Other Functions ---

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
    nextServerTeam = currentServerTeam;
    nextServerPlayer = currentServerPlayer;
    
    if (currentServerTeam === 'A') {
      newTeamAPositions = {
        evenCourtPlayer: teamAPositions.oddCourtPlayer,
        oddCourtPlayer: teamAPositions.evenCourtPlayer,
      };
      newTeamBPositions = teamBPositions;
    } else {
      newTeamBPositions = {
        evenCourtPlayer: teamBPositions.oddCourtPlayer,
        oddCourtPlayer: teamBPositions.evenCourtPlayer,
      };
      newTeamAPositions = teamAPositions;
    }
    
    nextReceiverPlayer = getReceiverByServer(nextServerPlayer, nextServerTeam, newTeamAPositions, newTeamBPositions);
  } else {
    // 规则2：发球方失分（接发球方得分）
    nextServerTeam = scoringTeam;
    newTeamAPositions = teamAPositions;
    newTeamBPositions = teamBPositions;
    
    const scoringTeamScore = scoringTeam === 'A' ? currentState.teamAScore : currentState.teamBScore;
    const scoringTeamPositions = scoringTeam === 'A' ? teamAPositions : teamBPositions;
    
    if (scoringTeamScore % 2 === 1) {
      nextServerPlayer = scoringTeamPositions.oddCourtPlayer;
    } else {
      nextServerPlayer = scoringTeamPositions.evenCourtPlayer;
    }
    
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
  teamBScore: number,
  scorers?: string[],
  onCourtPlayers?: { teamA: [string, string]; teamB: [string, string] }
): ScoreHistoryEntry {
  const entry: ScoreHistoryEntry = {
    sequenceNumber: history.length + 1,
    scoringSide,
    teamAScore,
    teamBScore,
    scorers,
    onCourtPlayers,
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
