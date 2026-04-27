import { describe, it, expect } from 'vitest'
import {
  isMatchFinished,
  isWuYunLunBiMatchFinished,
  getNextSinglesServer,
  getNextDoublesServer,
  handleWuYunServerScores,
  handleWuYunReceiverScores,
  applyWuYunRotation,
  detectWuYunRotationThreshold,
  getWuYunLunBiPlayerRotation,
  addScoreHistoryEntry,
  getScoringSideDisplay,
} from './scoring'
import type { DoublesMatchState, WuYunLunBiTeam } from '../types'
import { defaultDoublesState, defaultWuYunLunBiState } from '../../test/fixtures'

describe('isMatchFinished', () => {
  it('普通模式 - A队达到赛点应结束比赛', () => {
    const result = isMatchFinished(21, 10, 21, false)
    expect(result).toEqual({ finished: true, winner: 'A' })
  })

  it('普通模式 - B队达到赛点应结束比赛', () => {
    const result = isMatchFinished(15, 21, 21, false)
    expect(result).toEqual({ finished: true, winner: 'B' })
  })

  it('加分模式 - 达到赛点且领先2分应结束', () => {
    const result = isMatchFinished(22, 20, 21, true)
    expect(result).toEqual({ finished: true, winner: 'A' })
  })

  it('加分模式 - 达到赛点但未领先2分应继续', () => {
    const result = isMatchFinished(21, 20, 21, true)
    expect(result).toEqual({ finished: false, winner: null })
  })

  it('边界情况 - 20:20平分时应继续比赛', () => {
    const result = isMatchFinished(20, 20, 21, true)
    expect(result).toEqual({ finished: false, winner: null })
  })
})

describe('isWuYunLunBiMatchFinished', () => {
  it('A队达到总分应结束', () => {
    const result = isWuYunLunBiMatchFinished(50, 30, 50)
    expect(result).toEqual({ finished: true, winner: 'A' })
  })

  it('B队达到总分应结束', () => {
    const result = isWuYunLunBiMatchFinished(35, 50, 50)
    expect(result).toEqual({ finished: true, winner: 'B' })
  })
})

describe('getNextSinglesServer', () => {
  it('A队得分后应由A队发球', () => {
    const result = getNextSinglesServer('B', 'A')
    expect(result).toBe('A')
  })

  it('B队得分后应由B队发球', () => {
    const result = getNextSinglesServer('A', 'B')
    expect(result).toBe('B')
  })
})

describe('getNextDoublesServer', () => {
  const createState = (overrides: Partial<DoublesMatchState> = {}): DoublesMatchState => ({
    ...defaultDoublesState,
    ...overrides,
  })

  it('发球方得分 - A队交换场地并继续发球', () => {
    const state = createState({
      currentServerTeam: 'A',
      currentServerPlayer: 'A1',
      teamAPositions: { evenCourtPlayer: 'A1', oddCourtPlayer: 'A2' },
    })

    const result = getNextDoublesServer(state, 'A')

    expect(result.serverTeam).toBe('A')
    expect(result.serverPlayer).toBe('A1')
    expect(result.teamAPositions.evenCourtPlayer).toBe('A2')
    expect(result.teamAPositions.oddCourtPlayer).toBe('A1')
  })

  it('发球方得分 - B队交换场地并继续发球', () => {
    const state = createState({
      currentServerTeam: 'B',
      currentServerPlayer: 'B1',
      teamBPositions: { evenCourtPlayer: 'B1', oddCourtPlayer: 'B2' },
    })

    const result = getNextDoublesServer(state, 'B')

    expect(result.serverTeam).toBe('B')
    expect(result.teamBPositions.evenCourtPlayer).toBe('B2')
    expect(result.teamBPositions.oddCourtPlayer).toBe('B1')
  })

  it('接发球方得分(奇数) - 单数区球员发球', () => {
    const state = createState({
      currentServerTeam: 'B',
      teamAScore: 11, // 奇数
      teamAPositions: { evenCourtPlayer: 'A1', oddCourtPlayer: 'A2' },
    })

    const result = getNextDoublesServer(state, 'A')

    expect(result.serverTeam).toBe('A')
    expect(result.serverPlayer).toBe('A2') // 单数区
  })

  it('接发球方得分(偶数) - 双数区球员发球', () => {
    const state = createState({
      currentServerTeam: 'B',
      teamAScore: 10, // 偶数
      teamAPositions: { evenCourtPlayer: 'A1', oddCourtPlayer: 'A2' },
    })

    const result = getNextDoublesServer(state, 'A')

    expect(result.serverTeam).toBe('A')
    expect(result.serverPlayer).toBe('A1') // 双数区
  })

  it('验证接发球球员正确性 - 发球方在双数区则接发球方也在双数区', () => {
    const state = createState({
      currentServerTeam: 'A',
      currentServerPlayer: 'A1',
      teamAPositions: { evenCourtPlayer: 'A1', oddCourtPlayer: 'A2' },
      teamBPositions: { evenCourtPlayer: 'B1', oddCourtPlayer: 'B2' },
    })

    const result = getNextDoublesServer(state, 'A')

    // A队得分后交换场地，A1现在在单数区，所以接发球方B队也应该是单数区
    expect(result.receiverPlayer).toBe('B2') // B队单数区
  })
})

describe('handleWuYunServerScores', () => {
  it('A队发球得分 - 分数增加且交换场地', () => {
    const state = {
      ...defaultWuYunLunBiState,
      currentServerTeam: 'A' as const,
      teamAScore: 5,
      teamACourtPositions: { evenCourtPlayer: '张三', oddCourtPlayer: '李四' },
    }

    const result = handleWuYunServerScores(state)

    expect(result.teamAScore).toBe(6)
    expect(result.teamACourtPositions.evenCourtPlayer).toBe('李四')
    expect(result.teamACourtPositions.oddCourtPlayer).toBe('张三')
  })

  it('B队发球得分 - 分数增加且交换场地', () => {
    const state = {
      ...defaultWuYunLunBiState,
      currentServerTeam: 'B' as const,
      teamBScore: 8,
      teamBCourtPositions: { evenCourtPlayer: '周八', oddCourtPlayer: '吴九' },
    }

    const result = handleWuYunServerScores(state)

    expect(result.teamBScore).toBe(9)
    expect(result.teamBCourtPositions.evenCourtPlayer).toBe('吴九')
    expect(result.teamBCourtPositions.oddCourtPlayer).toBe('周八')
  })
})

describe('handleWuYunReceiverScores', () => {
  it('A队接发得分 - 发球权转移且根据分数确定新发球者', () => {
    const state = {
      ...defaultWuYunLunBiState,
      currentServerTeam: 'B' as const,
      teamAScore: 10, // 偶数，双数区发球
      teamACourtPositions: { evenCourtPlayer: '张三', oddCourtPlayer: '李四' },
      teamBCourtPositions: { evenCourtPlayer: '周八', oddCourtPlayer: '吴九' },
    }

    const result = handleWuYunReceiverScores(state)

    expect(result.teamAScore).toBe(11) // 10+1=11，奇数
    expect(result.currentServerTeam).toBe('A')
    expect(result.currentServerPlayer).toBe('李四') // 11是奇数，单数区
  })

  it('B队接发得分 - 发球权转移且根据分数确定新发球者', () => {
    const state = {
      ...defaultWuYunLunBiState,
      currentServerTeam: 'A' as const,
      teamBScore: 14, // 偶数
      teamACourtPositions: { evenCourtPlayer: '张三', oddCourtPlayer: '李四' },
      teamBCourtPositions: { evenCourtPlayer: '周八', oddCourtPlayer: '吴九' },
    }

    const result = handleWuYunReceiverScores(state)

    expect(result.teamBScore).toBe(15) // 14+1=15，奇数
    expect(result.currentServerTeam).toBe('B')
    expect(result.currentServerPlayer).toBe('吴九') // 15是奇数，单数区
  })
})

describe('detectWuYunRotationThreshold', () => {
  const teamA: WuYunLunBiTeam = {
    id: 'A',
    players: ['张三', '李四', '王五', '赵六', '孙七'],
  }
  const teamB: WuYunLunBiTeam = {
    id: 'B',
    players: ['周八', '吴九', '郑十', '钱十一', '陈十二'],
  }

  it('10分时触发第1次换人(索引0→2)', () => {
    const result = detectWuYunRotationThreshold(10, 5, teamA, teamB)

    expect(result.isRotationPoint).toBe(true)
    const aRotation = result.benchedPlayers.find(p => p.team === 'A')
    expect(aRotation?.out).toBe('张三')
    expect(aRotation?.in).toBe('王五')
  })

  it('20分时触发第2次换人(索引1→3)', () => {
    const result = detectWuYunRotationThreshold(20, 15, teamA, teamB)

    expect(result.isRotationPoint).toBe(true)
    const aRotation = result.benchedPlayers.find(p => p.team === 'A')
    expect(aRotation?.out).toBe('李四')
    expect(aRotation?.in).toBe('赵六')
  })

  it('30分时触发第3次换人(索引2→4)', () => {
    const result = detectWuYunRotationThreshold(30, 25, teamA, teamB)

    expect(result.isRotationPoint).toBe(true)
    const aRotation = result.benchedPlayers.find(p => p.team === 'A')
    expect(aRotation?.out).toBe('王五')
    expect(aRotation?.in).toBe('孙七')
  })

  it('非10的倍数时不触发换人', () => {
    const result = detectWuYunRotationThreshold(15, 10, teamA, teamB)
    expect(result.isRotationPoint).toBe(false)
  })

  it('50分时触发第5次换人(索引4→1)', () => {
    const result = detectWuYunRotationThreshold(50, 45, teamA, teamB)

    expect(result.isRotationPoint).toBe(true)
    const aRotation = result.benchedPlayers.find(p => p.team === 'A')
    expect(aRotation?.out).toBe('孙七')
    expect(aRotation?.in).toBe('李四')
  })
})

describe('applyWuYunRotation', () => {
  it('A队换人 - 新球员进入双数区', () => {
    const state = {
      ...defaultWuYunLunBiState,
      teamAScore: 10,
      teamBScore: 8,
      currentPlayerIndices: { teamA: [0, 1] as [number, number], teamB: [0, 1] as [number, number] },
    }

    const rotationInfo = {
      isRotationPoint: true,
      benchedPlayers: [
        { team: 'A' as const, out: '张三', in: '王五' },
        { team: 'B' as const, out: '周八', in: '郑十' },
      ],
    }

    const result = applyWuYunRotation(state, rotationInfo)

    expect(result.currentPlayerIndices.teamA[0]).toBe(2) // 新球员索引
    expect(result.teamACourtPositions.evenCourtPlayer).toBe('王五') // 新球员在双数区
  })

  it('换人后发球权归领先方', () => {
    const state = {
      ...defaultWuYunLunBiState,
      teamAScore: 12,
      teamBScore: 10,
      currentPlayerIndices: { teamA: [0, 1] as [number, number], teamB: [0, 1] as [number, number] },
    }

    const rotationInfo = {
      isRotationPoint: true,
      benchedPlayers: [
        { team: 'A' as const, out: '张三', in: '王五' },
        { team: 'B' as const, out: '周八', in: '郑十' },
      ],
    }

    const result = applyWuYunRotation(state, rotationInfo)

    expect(result.currentServerTeam).toBe('A') // A队领先
    expect(result.currentServerPlayer).toBe('王五') // A队新上场球员
  })
})

describe('getWuYunLunBiPlayerRotation', () => {
  const teamA: WuYunLunBiTeam = {
    id: 'A',
    players: ['张三', '李四', '王五', '赵六', '孙七'],
  }
  const teamB: WuYunLunBiTeam = {
    id: 'B',
    players: ['周八', '吴九', '郑十', '钱十一', '陈十二'],
  }

  it('0-9分阶段显示第1对球员', () => {
    const result = getWuYunLunBiPlayerRotation(5, 3, teamA, teamB)
    expect(result.currentPlayerIndices.teamA).toEqual([0, 1])
    expect(result.nextServerPlayer).toBe('张三')
  })

  it('10-19分阶段显示第2对球员', () => {
    const result = getWuYunLunBiPlayerRotation(15, 12, teamA, teamB)
    expect(result.currentPlayerIndices.teamA).toEqual([1, 2])
    expect(result.nextServerPlayer).toBe('李四')
  })
})

describe('addScoreHistoryEntry', () => {
  it('正确递增序号', () => {
    const history = [{ sequenceNumber: 1, scoringSide: 'A', teamAScore: 1, teamBScore: 0 }]
    const entry = addScoreHistoryEntry(history, 'A', 2, 0)
    expect(entry.sequenceNumber).toBe(2)
  })

  it('记录得分方和比分', () => {
    const entry = addScoreHistoryEntry([], 'B', 5, 3)
    expect(entry.scoringSide).toBe('B')
    expect(entry.teamAScore).toBe(5)
    expect(entry.teamBScore).toBe(3)
  })
})

describe('getScoringSideDisplay', () => {
  it('单打模式返回单个球员名', () => {
    const result = getScoringSideDisplay('singles', 'A', '张三', '李四')
    expect(result).toBe('张三')
  })

  it('双打模式返回两名球员名', () => {
    const result = getScoringSideDisplay('doubles', 'A', '张三', '李四')
    expect(result).toBe('张三 / 李四')
  })

  it('五羽伦比模式返回两名球员名', () => {
    const result = getScoringSideDisplay('wu-yun-lun-bi', 'A', '张三', '李四', ['张三', '李四', '王五', '赵六', '孙七'])
    expect(result).toBe('张三 / 李四')
  })
})
