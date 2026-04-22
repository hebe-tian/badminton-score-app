## 1. 数据结构与类型定义

- [x] 1.1 扩展 `src/types/index.ts` 中的 `ScoreHistoryEntry`，增加 `scorers: string[]` 和 `onCourtPlayers` 字段。
- [x] 1.2 在 `src/utils/scoring.ts` 中完善 `addScoreHistoryEntry` 函数，使其能根据模式生成包含完整元数据的记录对象。

## 2. 历史记录追踪逻辑实现

- [x] 2.1 修改 `App.tsx` 中的 `handleSinglesScore`，在加分后同步调用历史记录更新。
- [x] 2.2 修改 `App.tsx` 中的 `handleDoublesScore`，在加分后同步记录双打队伍成员信息。
- [x] 2.3 修改 `App.tsx` 中的 `handleWuYunLunBiScore`，在加分后捕获并存储当时的场上阵容快照。
- [x] 2.4 确保在 `handleRestart` 和 `handleBack` 触发时，对应的历史状态能被正确重置。

## 3. 得分记录弹窗组件开发

- [x] 3.1 创建 `src/components/ScoreRecordModal.tsx` 组件，实现基础弹窗 UI 及遮罩层。
- [x] 3.2 实现表格渲染逻辑，支持序号、得分者、队伍分数三列展示。
- [x] 3.3 实现“不足 8 行自动补齐空行”的逻辑，并确保空行单元格完全留白。
- [x] 3.4 为弹窗添加“确定”关闭按钮，点击后隐藏弹窗。

## 4. 集成与适配

- [x] 4.1 在 `SinglesMatch.tsx` 中引入弹窗，并在 `winner` 存在时渲染。
- [x] 4.2 在 `DoublesMatch.tsx` 中引入弹窗，并根据双打模式格式化得分者显示。
- [x] 4.3 在 `WuYunLunBiMatch.tsx` 中引入弹窗，并根据快照数据格式化五羽伦比得分者显示。
- [x] 4.4 调整各模式下的弹窗主题色，使其与当前比赛界面的视觉风格保持一致。
