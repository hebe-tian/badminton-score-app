import type { RotationInfo } from '../../src/types'

export interface MatchFinishedResult {
  finished: boolean
  winner: 'A' | 'B' | null
}

import { expect } from 'vitest'

export function expectRotationToBe(
  rotation: RotationInfo,
  expected: {
    isRotationPoint: boolean
    teamAOut?: string
    teamAIn?: string
    teamBOut?: string
    teamBIn?: string
  }
) {
  expect(rotation.isRotationPoint).toBe(expected.isRotationPoint)
  
  if (expected.isRotationPoint) {
    const teamARotation = rotation.benchedPlayers.find((p: { team: string }) => p.team === 'A')
    const teamBRotation = rotation.benchedPlayers.find((p: { team: string }) => p.team === 'B')
    
    if (expected.teamAOut) {
      expect(teamARotation?.out).toBe(expected.teamAOut)
    }
    if (expected.teamAIn) {
      expect(teamARotation?.in).toBe(expected.teamAIn)
    }
    if (expected.teamBOut) {
      expect(teamBRotation?.out).toBe(expected.teamBOut)
    }
    if (expected.teamBIn) {
      expect(teamBRotation?.in).toBe(expected.teamBIn)
    }
  }
}

export function expectMatchFinished(
  result: MatchFinishedResult,
  expected: {
    finished: boolean
    winner: 'A' | 'B' | null
  }
) {
  expect(result.finished).toBe(expected.finished)
  expect(result.winner).toBe(expected.winner)
}
