import type { SinglesMatchState } from '../../src/types'

export const defaultSinglesState: SinglesMatchState = {
  mode: 'singles',
  matchPoint: 21,
  extendMatch: false,
  teamAName: '张三',
  teamBName: '李四',
  firstServer: 'A',
  teamAScore: 0,
  teamBScore: 0,
  currentServer: 'A',
  isFinished: false,
  winner: null,
}

export function createSinglesState(
  overrides: Partial<SinglesMatchState> = {}
): SinglesMatchState {
  return {
    ...defaultSinglesState,
    ...overrides,
  }
}

export const scenarios = {
  aLeading: createSinglesState({
    teamAScore: 15,
    teamBScore: 10,
    currentServer: 'A',
  }),
  
  bLeading: createSinglesState({
    teamAScore: 8,
    teamBScore: 14,
    currentServer: 'B',
  }),
  
  tied: createSinglesState({
    teamAScore: 20,
    teamBScore: 20,
    extendMatch: true,
    currentServer: 'A',
  }),
  
  aWon: createSinglesState({
    teamAScore: 21,
    teamBScore: 15,
    isFinished: true,
    winner: 'A',
  }),
  
  bWon: createSinglesState({
    teamAScore: 18,
    teamBScore: 21,
    isFinished: true,
    winner: 'B',
  }),
}
