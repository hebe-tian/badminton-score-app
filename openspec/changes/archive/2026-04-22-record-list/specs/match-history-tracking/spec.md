## ADDED Requirements

### Requirement: 实时同步得分历史
系统 SHALL 在每一次加分动作发生时，同步更新内存中的 `ScoreHistory` 状态。

#### Scenario: 单打加分记录
- **WHEN** 用户在单打模式中点击加分按钮
- **THEN** 历史记录数组中应新增一条包含序号、得分者姓名及最新比分的记录

#### Scenario: 五羽伦比分加记录
- **WHEN** 用户在五羽伦比模式中点击加分按钮
- **THEN** 历史记录中除基础信息外，还应保存该瞬间双方在场球员的姓名快照

### Requirement: 数据结构扩展支持
`ScoreHistoryEntry` 接口 SHALL 包含足以支持未来导出功能的元数据字段。

#### Scenario: 存储场上阵容
- **WHEN** 创建一条五羽伦比的得分记录
- **THEN** 记录对象中必须包含 `onCourtPlayers` 字段，准确反映当时的场地站位

### Requirement: 状态重置逻辑
系统 SHALL 在用户选择“重新开始”或“返回主页”时，清空当前模式的历史记录。

#### Scenario: 重新开始比赛
- **WHEN** 用户在比赛结束后点击“重新开始”
- **THEN** 对应的 `history` 状态应被重置为空数组，确保下一场比赛从零开始记录
