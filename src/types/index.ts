export type MatchPoint = 15 | 21 | number;

export interface SinglesMatchConfig {
  mode: 'singles';
  matchPoint: MatchPoint;
  extendMatch: boolean;
  player1Name: string;
  player2Name: string;
  firstServer: 1 | 2;
}

export interface SinglesMatchState extends SinglesMatchConfig {
  player1Score: number;
  player2Score: number;
  currentServer: 1 | 2;
  isFinished: boolean;
  winner: 1 | 2 | null;
}

export interface DoublesTeam {
  id: 'A' | 'B';
  player1Name: string;
  player2Name: string;
}

export interface DoublesMatchConfig {
  mode: 'doubles';
  matchPoint: MatchPoint;
  extendMatch: boolean;
  teamA: DoublesTeam;
  teamB: DoublesTeam;
  firstServerTeam: 'A' | 'B';
  firstServerPlayer: string;
  firstReceiverPlayer: string;
}

// 双打队伍位置追踪
export interface TeamPositions {
  evenCourtPlayer: string;  // 双数区球员标识符 (A1/A2 或 B1/B2)
  oddCourtPlayer: string;   // 单数区球员标识符 (A1/A2 或 B1/B2)
}

export interface DoublesMatchState extends DoublesMatchConfig {
  teamAScore: number;
  teamBScore: number;
  currentServerTeam: 'A' | 'B';
  currentServerPlayer: string;
  currentReceiverPlayer: string;
  // 位置追踪：记录每个队伍中谁在双数区、谁在单数区
  teamAPositions: TeamPositions;
  teamBPositions: TeamPositions;
  isFinished: boolean;
  winner: 'A' | 'B' | null;
}

export interface WuYunLunBiTeam {
  id: 'A' | 'B';
  players: [string, string, string, string, string];
}

export interface WuYunLunBiMatchConfig {
  mode: 'wu-yun-lun-bi';
  totalPoints: 50 | 100;
  teamA: WuYunLunBiTeam;
  teamB: WuYunLunBiTeam;
  firstServerTeam: 'A' | 'B';
  firstServerPlayer: string;
  firstReceiverPlayer: string;
}

export interface WuYunLunBiMatchState extends WuYunLunBiMatchConfig {
  teamAScore: number;
  teamBScore: number;
  currentServerTeam: 'A' | 'B';
  currentServerPlayer: string;
  currentReceiverPlayer: string;
  currentPlayerIndices: {
    teamA: [number, number];
    teamB: [number, number];
  };
  isFinished: boolean;
  winner: 'A' | 'B' | null;
}

export interface ScoreHistoryEntry {
  sequenceNumber: number;
  scoringSide: string;
  teamAScore: number;
  teamBScore: number;
}

export interface ScoreHistory {
  entries: ScoreHistoryEntry[];
  matchMode: 'singles' | 'doubles' | 'wu-yun-lun-bi';
  matchResult?: {
    winner: 'A' | 'B' | '1' | '2';
    finalScore: { teamA: number; teamB: number };
  };
}

export type MatchState = SinglesMatchState | DoublesMatchState | WuYunLunBiMatchState;
