# 五羽伦比计分功能实现任务列表

## 第一阶段：类型定义

### 任务 1.1: 更新 CourtPositions 类型
**文件**: `badminton-score-app/src/types/index.ts`  
**操作**: 添加 `CourtPositions` 接口
```typescript
export interface CourtPositions {
  evenCourtPlayer: string; // 双数区球员
  oddCourtPlayer: string;  // 单数区球员
}
```

### 任务 1.2: 扩展 WuYunLunBiMatchState
**文件**: `badminton-score-app/src/types/index.ts`  
**操作**: 向 `WuYunLunBiMatchState` 添加场地位置字段
- 添加 `teamACourtPositions: CourtPositions`
- 添加 `teamBCourtPositions: CourtPositions`
- 保留现有的 `currentPlayerIndices` 用于 UI 显示

**依赖**: 任务 1.1

---

## 第二阶段：核心逻辑实现

### 任务 2.1: 实现辅助函数
**文件**: `badminton-score-app/src/utils/scoring.ts`  
**操作**: 添加工具函数
- `swapCourts(positions: CourtPositions): CourtPositions` - 交换单双数区
- `getReceiverByServer(...)` - 根据发球人确定接发球人

**依赖**: 任务 1.1

### 任务 2.2: 重构 handleServerScores（发球方得分）
**文件**: `badminton-score-app/src/utils/scoring.ts`  
**操作**: 创建处理发球方得分的函数
- 为发球方加分
- 交换发球方的场地位置
- 保持同一发球人
- 根据新位置确定接发球人
- 返回更新后的状态

**依赖**: 任务 2.1

### 任务 2.3: 重构 handleReceiverScores（接发球方得分）
**文件**: `badminton-score-app/src/utils/scoring.ts`  
**操作**: 创建处理接发球方得分的函数
- 为接发球方加分
- 保持所有位置不变
- 转换发球权给得分方
- 根据比分单双性选择新发球人（单数分→单数区，双数分→双数区）
- 根据新发球人位置确定接发球人
- 返回更新后的状态

**依赖**: 任务 2.1

### 任务 2.4: 增强 detectRotationThreshold（检测换人阈值）
**文件**: `badminton-score-app/src/utils/scoring.ts`  
**操作**: 更新现有函数以返回详细的换人信息
- 返回包含队伍、下场球员、上场球员的 `benchedPlayers` 数组
- 同时支持 50 分和 100 分模式（循环换人）
- 使用球员索引而非硬编码名称

**依赖**: 无（基于现有函数增强）

### 任务 2.5: 实现 applyRotation（应用换人）
**文件**: `badminton-score-app/src/utils/scoring.ts`  
**操作**: 创建应用换人变更的函数
- 根据换人规则更新 `currentPlayerIndices`
- 重置位置：新上场球员 → 双数区，剩余球员 → 单数区
- 指定领先队伍的新上场球员（在双数区）发球
- 指定落后队伍的新上场球员（在双数区）接发球
- 返回完全更新后的状态

**依赖**: 任务 2.4

### 任务 2.6: 创建统一的 handleWuYunLunBiScore
**文件**: `badminton-score-app/src/utils/scoring.ts`  
**操作**: 创建协调所有逻辑的主计分处理器
- 判断是发球方还是接发球方得分
- 调用相应的处理器（任务 2.2 或 2.3）
- 检查是否达到换人阈值
- 如果需要换人，准备换人数据（但暂不应用，交由 UI 弹窗处理）
- 返回更新后的状态和换人信息

**依赖**: 任务 2.2, 2.3, 2.4

---

## 第三阶段：设置界面组件

### 任务 3.1: 更新 WuYunLunBiSetup UI 结构
**文件**: `badminton-score-app/src/components/WuYunLunBiSetup.tsx`  
**操作**: 确保球员名称输入框布局正确
- A队和B队各一个卡片
- 每个卡片包含5个带标签（A1-A5, B1-B5）的文本输入框
- 输入框应有合适的占位符文本

**依赖**: 无（验证现有组件结构）

### 任务 3.2: 实现互斥的发球选择
**文件**: `badminton-score-app/src/components/WuYunLunBiSetup.tsx`  
**操作**: 限制发球选择范围为每队的前两名球员
- 发球下拉选项：[A1, A2, B1, B2]
- 选择发球人时确定发球队伍

**依赖**: 无

### 任务 3.3: 实现动态接发球选择
**文件**: `badminton-score-app/src/components/WuYunLunBiSetup.tsx`  
**操作**: 根据发球选择更新接发球选项
- 如果发球方来自 A 队，接发球选项为：[B1, B2]
- 如果发球方来自 B 队，接发球选项为：[A1, A2]
- 禁用或隐藏不可用选项
- 如果当前接发球选择失效，自动清空（方案 A）

**依赖**: 任务 3.2

### 任务 3.4: 添加分数模式切换
**文件**: `badminton-score-app/src/components/WuYunLunBiSetup.tsx`  
**操作**: 确保 50/100 分切换功能正常
- 两个按钮或单选按钮用于 50 分和 100 分
- 高亮显示已选选项
- 选择时更新配置状态

**依赖**: 无（验证现有实现）

---

## 第四阶段：比赛界面组件

### 任务 4.1: 添加场地可视化
**文件**: `badminton-score-app/src/components/WuYunLunBiMatch.tsx`  
**操作**: 展示带有球员位置的场地布局
- 显示 A队双数区 和 A队单数区
- 显示 B队单数区 和 B队双数区
- 在各自区域内显示球员名称
- 状态变化时响应式更新位置

**依赖**: 任务 1.2（新状态字段）

### 任务 4.2: 添加发球/接发球标识
**文件**: `badminton-score-app/src/components/WuYunLunBiMatch.tsx`  
**操作**: 显示发球人和接发球人的视觉标识
- 在发球人名字旁添加“发”字徽章
- 在接发球人名字旁添加“接”字徽章
- 使用鲜明的颜色或图标以提高清晰度

**依赖**: 任务 4.1

### 任务 4.3: 实现换人弹窗状态管理
**文件**: `badminton-score-app/src/components/WuYunLunBiMatch.tsx`  
**操作**: 添加弹窗状态管理
- 添加 `showRotationModal` 状态（布尔值）
- 添加 `pendingRotation` 状态（RotationInfo | null）
- 每次得分更新后检测换人阈值
- 需要换人时显示弹窗

**依赖**: 任务 2.4

### 任务 4.4: 构建换人弹窗 UI
**文件**: `badminton-score-app/src/components/WuYunLunBiMatch.tsx`  
**操作**: 创建用于确认换人的弹窗组件
- 显示标题：“换人提醒”
- 显示 A 队变动：“A队：{out} 下场 → {in} 上场”
- 显示 B 队变动：“B队：{out} 下场 → {in} 上场”
- 添加“确认”按钮以继续
- 在确认前阻止进一步得分

**依赖**: 任务 4.3

### 任务 4.5: 处理换人确认
**文件**: `badminton-score-app/src/components/WuYunLunBiMatch.tsx`  
**操作**: 用户确认时应用换人
- 使用当前状态和换人信息调用 `applyRotation` 函数
- 用新位置和球员更新比赛状态
- 关闭弹窗
- 恢复比赛

**依赖**: 任务 2.5, 4.4

### 任务 4.6: 弹窗期间禁用得分
**文件**: `badminton-score-app/src/components/WuYunLunBiMatch.tsx`  
**操作**: 防止在换人弹窗打开时得分
- 当 `showRotationModal` 为 true 时禁用得分按钮
- 弹窗关闭后重新启用

**依赖**: 任务 4.3

---

## 第五阶段：应用集成

### 任务 5.1: 更新 handleWuYunLunBiStart
**文件**: `badminton-score-app/src/App.tsx`  
**操作**: 在比赛开始时初始化场地位置
- 根据首发发球/接发球设置初始位置
- 发球人去双数区，队友去单数区
- 接发球人去双数区，队友去单数区
- 存入 `teamACourtPositions` 和 `teamBCourtPositions`

**依赖**: 任务 1.2

### 任务 5.2: 重构 handleWuYunLunBiScore
**文件**: `badminton-score-app/src/App.tsx`  
**操作**: 使用新的统一计分处理器
- 调用 utils 中的 `handleWuYunLunBiScore`
- 用返回值更新状态
- 检查换人信息
- 如果需要换人，在组件中触发弹窗（不在 App 中处理）
- 更新得分历史

**依赖**: 任务 2.6

### 任务 5.3: 更新 handleRestart
**文件**: `badminton-score-app/src/App.tsx`  
**操作**: 重新开始比赛时重置场地位置
- 与任务 5.1 相同的方式重新初始化位置
- 清除任何待处理的换人状态

**依赖**: 任务 5.1

---

## 第六阶段：测试与验证

### 任务 6.1: 手动测试 - 发球方得分
**操作**: 验证发球方得分流程
- 以 A1 发球开始比赛
- 为 A 队得分
- 验证 A1 是否根据比分单双性移动到正确的区域
- 验证 A1 是否继续发球
- 验证接发球人是否正确更新

**依赖**: 所有之前的任务

### 任务 6.2: 手动测试 - 接发球方得分
**操作**: 验证接发球方得分流程
- 以 A1 发球开始比赛
- 为 B 队得分
- 验证发球权是否转移给 B 队
- 验证是否根据比分单双性选择了新发球人
- 验证位置是否保持不变

**依赖**: 所有之前的任务

### 任务 6.3: 手动测试 - 10分节点换人
**操作**: 验证换人逻辑
- 比赛直到比分达到 10
- 验证弹窗是否出现并显示正确的球员变动
- 确认换人
- 验证新球员是否在双数区
- 验证剩余球员是否在单数区
- 验证领先队伍的新球员是否发球

**依赖**: 所有之前的任务

### 任务 6.4: 手动测试 - 多次换人
**操作**: 验证循环换人
- 继续比赛经过 20, 30, 40 分节点
- 验证每个阈值是否有正确的球员轮换
- 对于 100 分模式，验证超过 50 分后换人是否继续

**依赖**: 任务 6.3

### 任务 6.5: 边界情况 - 快速连续得分
**操作**: 测试快速连续得分
- 尝试在弹窗出现前快速得分
- 验证没有状态损坏
- 验证弹窗是否能阻止进一步得分

**依赖**: 任务 4.6

---

## 总结

**总任务数**: 6个阶段共 23 个任务  
**预计复杂度**: 中高（复杂的状态管理和业务逻辑）  
**关键路径**: 第二阶段（核心逻辑）→ 第四阶段（比赛组件）→ 第五阶段（集成）

**需要修改的关键文件**:
1. `badminton-score-app/src/types/index.ts` - 类型定义
2. `badminton-score-app/src/utils/scoring.ts` - 核心算法
3. `badminton-score-app/src/components/WuYunLunBiSetup.tsx` - 设置界面
4. `badminton-score-app/src/components/WuYunLunBiMatch.tsx` - 比赛界面
5. `badminton-score-app/src/App.tsx` - 状态协调
