# 归档说明 - 2026年4月

## 五羽伦比换人后发球/接发逻辑修复

**归档日期**: 2026-04-21  
**原始位置**: `/Users/linleil/Library/Application Support/Lingma/SharedClientCache/cli/specs/five-round-scoring.md`  
**归档文件**: `five-round-rotation-fix.md`

### 修改概述

修复了五羽伦比比赛中达到10分节点换人时，新上场球员没有正确担任发球/接发球人的问题。

### 问题分析

发现 `applyWuYunRotation` 函数中存在两个关键bug：

1. **接发球人分配错误**：原代码总是选择接发球方双数区球员作为接发球人，没有根据发球人所在区域确定对应的接发球人
2. **场地位置分配不正确**：`getNewIndices` 函数只是简单替换下场球员索引，不保证新上场球员被放置在双数区
3. **lastRotationScore 未更新**：导致可能重复触发换人弹窗

### 主要变更

1. **核心逻辑修复** (`src/utils/scoring.ts`)
   - 创建新的辅助函数 `getNewIndicesWithCourtPositioning`，确保：
     - 新上场球员 → 双数区（even court，索引0）
     - 留下球员 → 单数区（odd court，索引1）
   - 使用 `getReceiverByServerForWuYun` 辅助函数正确确定接发球人：
     - 发球人在双数区 → 接发球人也在双数区
     - 发球人在单数区 → 接发球人也在单数区
   - 在返回值中添加 `lastRotationScore` 更新，防止重复弹窗

2. **删除废弃代码**
   - 移除旧的 `getNewIndices` 函数，使用新的 `getNewIndicesWithCourtPositioning` 替代

### 涉及文件

- `badminton-score-app/src/utils/scoring.ts` - 核心修复位置（applyWuYunRotation 函数，第150-224行）

### 修复后的行为

当达到10分节点进行换人时：
1. 新上场球员被正确放置在双数区
2. 领先队伍的新上场球员（在双数区）担任发球人
3. 落后队伍的新上场球员（在双数区）担任接发球人
4. 场地可视化正确显示"发"和"接"标识
5. lastRotationScore 被更新以防止重复触发换人弹窗
6. 换人后可以正常继续比赛，发球/接发球轮换逻辑正常工作

### Git分支

无（本地修复，未提交到git）
