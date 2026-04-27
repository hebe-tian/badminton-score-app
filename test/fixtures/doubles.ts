import type { DoublesMatchState } from '../../src/types'

export const defaultDoublesState: DoublesMatchState = {
  mode: 'doubles',
  matchPoint: 21,
  extendMatch: false,
  teamA: {
    id: 'A',
    player1Name: '张三',
    player2Name: '李四',
  },
  teamB: {
    id: 'B',
    player1Name: '王五',
    player2Name: '赵六',
  },
  firstServerTeam: 'A',
  firstServerPlayer: 'A1',
  firstReceiverPlayer: 'B1',
  teamAScore: 0,
  teamBScore: 0,
  currentServerTeam: 'A',
  currentServerPlayer: 'A1',
  currentReceiverPlayer: 'B1',
  teamAPositions: {
    evenCourtPlayer: 'A1',
    oddCourtPlayer: 'A2',
  },
  teamBPositions: {
    evenCourtPlayer: 'B1',
    oddCourtPlayer: 'B2',
  },
  isFinished: false,
  winner: null,
}

export function createDoublesState(
  overrides: Partial<DoublesMatchState> = {}
): DoublesMatchState {
  return {
    ...defaultDoublesState,
    ...overrides,
  }
}

export const scenarios = {
  aLeading: createDoublesState({
    teamAScore: 15,
    teamBScore: 10,
    currentServerTeam: 'A',
  }),
  
  bLeading: createDoublesState({
    teamAScore: 8,
    teamBScore: 14,
    currentServerTeam: 'B',
  }),
  
  tied: createDoublesState({
    teamAScore: 20,
    teamBScore: 20,
    extendMatch: true,
    currentServerTeam: 'A',
  }),
  
  positionsSwapped: createDoublesState({
    teamAPositions: {
      evenCourtPlayer: 'A2',
      oddCourtPlayer: 'A1',
    },
    teamBPositions: {
      evenCourtPlayer: 'B2',
      oddCourtPlayer: 'B1',
    },
  }),
  
  bServing: createDoublesState({
    currentServerTeam: 'B',
    currentServerPlayer: 'B1',
    currentReceiverPlayer: 'A1',
  }),
  
  aWon: createDoublesState({
    teamAScore: 21,
    teamBScore: 15,
    isFinished: true,
    winner: 'A',
  }),
}
