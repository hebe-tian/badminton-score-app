## Why

五羽伦比模式需要实现符合羽毛球规则的复杂比赛逻辑，包括：
- 精确的站位追踪（单双数区）
- 基于得分的单双数区切换
- 每10分的选手轮换与位置重置
- 发球权转移规则

当前实现缺少这些核心逻辑，需要重新设计以符合官方规则。

## What Changes

- **更新设置界面 UI**：
  - A/B两队各5名选手名称输入框（默认A1-A5, B1-B5）
  - 首发发球/接发球选择控件，支持互斥逻辑（发球选A队则接发只能选B队前2名，反之亦然）
  - 50分/100分单选按钮
  
- **实现核心比赛逻辑**：
  - 场地位置追踪：记录每队谁在单数区、谁在双数区
  - 发球方得分：加分后发球方交换位置，同一人继续发球
  - 接发球方得分：加分后转换发球权，新发球方按分数单双选择发球人
  - 换人规则：领先队伍达到10/20/30/40分时，双方同时换人并重置位置（新上场→双数区，剩余→单数区）
  
- **增强交互体验**：
  - 换人时弹出模态框显示上下场信息，需用户确认
  - 实时显示发球/接发球标识及站位

## Non-Goals

- 后端集成或数据持久化
- 高级动画效果
- 深色模式或其他主题定制
- 工具 Tab 功能扩展

## Capabilities

### New Capabilities

- `wu-yun-lun-bi-court-positioning`: 场地位置追踪，记录每队球员在单双数区的分布
- `wu-yun-lun-bi-score-based-rotation`: 基于得分的位置切换与发球权转移
- `wu-yun-lun-bi-player-substitution`: 每10分的选手轮换与位置重置逻辑
- `wu-yun-lun-bi-setup-validation`: 设置界面的互斥选择验证

### Modified Capabilities

- `wu-yun-lun-bi-match`: 重构现有组件以支持新的比赛逻辑和UI展示

## Impact

- 修改 `types/index.ts` 添加 `courtPositions` 字段
- 重写 `scoring.ts` 中的五羽伦比逻辑函数
- 重构 `WuYunLunBiSetup.tsx` 实现互斥选择
- 重构 `WuYunLunBiMatch.tsx` 增加场地可视化与换人弹窗
- 更新 `App.tsx` 中的状态管理逻辑
