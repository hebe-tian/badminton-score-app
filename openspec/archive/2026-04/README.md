# 归档说明 - 2026年4月

## 双打模式发球轮换逻辑修复

**归档日期**: 2026-04-20  
**原始位置**: `openspec/changes/fix-doubles-server-rotation/double-mode.md`  
**归档文件**: `double-mode-fix.md`

### 修改概述

根据设计文档修复了双打模式的发球轮换逻辑，实现了完整的羽毛球双打规则。

### 主要变更

1. **类型扩展** (`src/types/index.ts`)
   - 新增 `TeamPositions` 接口追踪球员位置
   - 在 `DoublesMatchState` 中添加 `teamAPositions` 和 `teamBPositions`

2. **核心逻辑** (`src/utils/scoring.ts`)
   - 重写 `getNextDoublesServer` 函数实现三种规则：
     - 发球方得分：交换位置，同一人继续发球
     - 发球方失分：位置不变，按分数单双选发球人
     - 接发球确定：区域一一对应

3. **状态管理** (`src/App.tsx`)
   - 修正初始化逻辑：发球和接发球球员都在双数区
   - 更新得分处理和重新开始逻辑

4. **UI显示** (`src/components/DoublesMatch.tsx`)
   - A队：左侧双数区，右侧单数区
   - B队：左侧单数区，右侧双数区（面对面站位）

### 涉及文件

- `src/types/index.ts`
- `src/utils/scoring.ts`
- `src/App.tsx`
- `src/components/DoublesMatch.tsx`

### Git分支

`feature/double-mode-fix`
