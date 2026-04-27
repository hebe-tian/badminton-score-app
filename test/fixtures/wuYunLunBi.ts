import type { WuYunLunBiMatchState } from '../../src/types'

export const defaultWuYunLunBiState: WuYunLunBiMatchState = {
  mode: 'wu-yun-lun-bi',
  totalPoints: 50,
  teamA: {
    id: 'A',
    players: ['张三', '李四', '王五', '赵六', '孙七'],
  },
  teamB: {
    id: 'B',
    players: ['周八', '吴九', '郑十', '钱十一', '陈十二'],
  },
  firstServerTeam: 'A',
  firstServerPlayer: '张三',
  firstReceiverPlayer: '周八',
  teamAScore: 0,
  teamBScore: 0,
  currentServerTeam: 'A',
  currentServerPlayer: '张三',
  currentReceiverPlayer: '周八',
  teamACourtPositions: {
    evenCourtPlayer: '张三',
    oddCourtPlayer: '李四',
  },
  teamBCourtPositions: {
    evenCourtPlayer: '周八',
    oddCourtPlayer: '吴九',
  },
  currentPlayerIndices: {
    teamA: [0, 1],
    teamB: [0, 1],
  },
  lastRotationScore: 0,
  isFinished: false,
  winner: null,
}

export function createWuYunState(
  overrides: Partial<WuYunLunBiMatchState> = {}
): WuYunLunBiMatchState {
  return {
    ...defaultWuYunLunBiState,
    ...overrides,
  }
}

export const scenarios = {
  aLeading: createWuYunState({
    teamAScore: 15,
    teamBScore: 10,
    currentServerTeam: 'A',
  }),
  
  bLeading: createWuYunState({
    teamAScore: 8,
    teamBScore: 14,
    currentServerTeam: 'B',
  }),
  
  atRotationPoint: createWuYunState({
    teamAScore: 10,
    teamBScore: 8,
    lastRotationScore: 0,
  }),
  
  phase2: createWuYunState({
    teamAScore: 25,
    teamBScore: 20,
    currentPlayerIndices: {
      teamA: [2, 3],
      teamB: [2, 3],
    },
  }),
  
  aWon: createWuYunState({
    teamAScore: 50,
    teamBScore: 35,
    isFinished: true,
    winner: 'A',
  }),
}
