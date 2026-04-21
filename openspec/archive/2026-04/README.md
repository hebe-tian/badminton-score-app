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

---

## 五羽伦比计分功能实现

**归档日期**: 2026-04-21  
**原始位置**: `openspec/changes/five-round/`  
**归档目录**: `five-round-scoring/`

### 修改概述

实现了完整的五羽伦比（Five-Round）计分系统，包括场地可视化、换人逻辑、发球/接发球轮换等功能。

### 主要变更

1. **类型定义** (`src/types/index.ts`)
   - 新增 `CourtPositions` 接口追踪球员在双数区/单数区的位置
   - 扩展 `WuYunLunBiMatchState` 添加场地位置字段和换人追踪

2. **核心逻辑** (`src/utils/scoring.ts`)
   - 实现辅助函数 `swapCourts` 和 `getReceiverByServerForWuYun`
   - 重构 `handleWuYunServerScores` 处理发球方得分
   - 重构 `handleWuYunReceiverScores` 处理接发球方得分
   - 增强 `detectWuYunRotationThreshold` 检测10分节点换人
   - 实现 `applyWuYunRotation` 应用换人逻辑（含修复：确保新上场球员去双数区）

3. **设置界面** (`src/components/WuYunLunBiSetup.tsx`)
   - 实现互斥的发球选择（仅限每队前两名球员）
   - 实现动态接发球选择（根据发球方自动过滤选项）
   - 添加50/100分模式切换

4. **比赛界面** (`src/components/WuYunLunBiMatch.tsx`)
   - 添加场地可视化（显示双数区/单数区及球员位置）
   - 添加发球/接发球标识（"发"和"接"徽章）
   - 实现换人弹窗状态管理和UI
   - 弹窗期间禁用得分按钮

5. **应用集成** (`src/App.tsx`)
   - 更新 `handleWuYunLunBiStart` 初始化场地位置
   - 重构 `handleWuYunLunBiScore` 使用统一的计分处理器
   - 添加换人确认处理函数

### 涉及文件

- `src/types/index.ts`
- `src/utils/scoring.ts`
- `src/components/WuYunLunBiSetup.tsx`
- `src/components/WuYunLunBiMatch.tsx`
- `src/App.tsx`

### 关键修复

在实现过程中发现并修复了换人逻辑的bug：
- 创建 `getNewIndicesWithCourtPositioning` 确保新上场球员正确放置在双数区
- 使用 `getReceiverByServerForWuYun` 正确确定接发球人
- 添加 `lastRotationScore` 更新防止重复触发换人弹窗

### Git分支

无（本地实现，未提交到git）
