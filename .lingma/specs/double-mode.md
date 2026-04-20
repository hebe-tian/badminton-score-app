# 双打模式发球轮换规则修复计划

## Context（背景）

当前双打模式的发球轮换逻辑与设计文档 `openspec/changes/fix-doubles-server-rotation/double-mode.md` 中的规则不符。需要修复以下问题：

1. **缺少位置追踪**：没有记录球员在单数区还是双数区
2. **发球轮换错误**：无论得分失分都切换发球人，而非根据规则决定
3. **接发球逻辑不完整**：未实现"发球方位置决定接发球方位置"的一一对应规则

## 核心规则（来自设计文档）

### 场地布局
```
|A队双数区|A队单数区|
|B队单数区|B队双数区|
```

### 三种轮换规则
1. **发球方得分**：加分 → 发球方两人交换位置 → 同一人继续发球 → 接发球方位置不变
2. **发球方失分**：加分 → 双方位置不变 → 转换发球权 → 新发球方按分数单双选择发球人
3. **接发球确定**：A队单数区发球 → B队单数区接发；A队双数区发球 → B队双数区接发

## 实施方案

### 1. 扩展类型定义 (`src/types/index.ts`)

添加位置追踪字段到 `DoublesMatchState`：

```typescript
export interface DoublesMatchState extends DoublesMatchConfig {
  // ... 现有字段
  
  // 新增：位置追踪
  teamAPositions: {
    evenCourtPlayer: string;  // 双数区球员标识符 (A1/A2)
    oddCourtPlayer: string;   // 单数区球员标识符 (A1/A2)
  };
  teamBPositions: {
    evenCourtPlayer: string;  // 双数区球员标识符 (B1/B2)
    oddCourtPlayer: string;   // 单数区球员标识符 (B1/B2)
  };
}
```

### 2. 修改初始化逻辑 (`src/App.tsx`)

在 `handleDoublesStart` 中根据首发球员设置初始位置：

- 如果 A1 发球，则 A1 在 A队双数区，A2 在 A队单数区
- 如果 B1 接发球，则 B1 在 B队单数区，B2 在 B队双数区
- 根据发球/接发球球员自动推断双方初始位置

### 3. 重写发球轮换函数 (`src/utils/scoring.ts`)

替换 `getNextDoublesServer` 函数，实现完整规则：

```typescript
export function getNextDoublesServer(
  currentState: DoublesMatchState,
  scoringTeam: 'A' | 'B'
): {
  serverTeam: 'A' | 'B';
  serverPlayer: string;
  receiverPlayer: string;
  teamAPositions: TeamPositions;
  teamBPositions: TeamPositions;
} {
  const isScorer = currentState.currentServerTeam === scoringTeam;
  
  if (isScorer) {
    // 规则1：发球方得分
    // - 发球方交换位置
    // - 同一人继续发球
    // - 接发球方位置不变
    return handleServerScore(currentState);
  } else {
    // 规则2：发球方失分
    // - 双方位置不变
    // - 转换发球权
    // - 新发球方按分数单双选择发球人
    return handleReceiverScore(currentState);
  }
}
```

**辅助函数：**
- `handleServerScore()`: 处理发球方得分场景
- `handleReceiverScore()`: 处理接发球方得分场景  
- `getReceiverByServer(serverPlayer, teamPositions)`: 根据发球人位置确定接发球人

### 4. 更新比赛页面 (`src/components/DoublesMatch.tsx`)

修改 UI 显示逻辑以反映真实位置：

- 左侧显示双数区球员
- 右侧显示单数区球员
- 保持"发"/"接"标注

布局示例：
```tsx
// A队行
<div className="team-row">
  <span>{teamAPositions.evenCourtPlayerName}</span>  {/* 双数区 */}
  <span>{teamAPositions.oddCourtPlayerName}</span>   {/* 单数区 */}
</div>
```

### 5. 更新重新开始逻辑

在 `handleRestart` 中重置位置状态为初始配置。

## 关键文件清单

1. `src/types/index.ts` - 添加位置追踪类型
2. `src/utils/scoring.ts` - 重写发球轮换逻辑
3. `src/App.tsx` - 修改初始化和得分处理
4. `src/components/DoublesMatch.tsx` - 更新UI显示
5. `src/components/DoublesSetup.tsx` - 可能需要调整（如果涉及配置变更）

## 验证步骤

1. **测试场景1 - 发球方得分**
   - 初始：A1(发)在双数区，A2在单数区，B2(接)在单数区，B1在双数区
   - A队得分后：A1和A2交换位置，A1继续发球，B2接发球
   - 验证：位置正确交换，发球人不变

2. **测试场景2 - 发球方失分**
   - 初始：同上
   - B队得分后：位置不变，B队发球，B队分数=1(单数)，B2在单数区发球
   - 验证：A队单数区的A2接发球

3. **测试场景3 - 连续得分**
   - 模拟多轮得分，验证位置轮换符合规则

4. **边界情况**
   - 比分从单数变双数时的发球人切换
   - 比赛结束后重新开始

## 注意事项

- 保持向后兼容，不影响单打和五羽伦比模式
- 确保 TypeScript 类型安全
- UI 显示要清晰反映位置关系
- 注释要说明规则逻辑，便于后续维护
