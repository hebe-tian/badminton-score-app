# Functional Requirements - Five-Round Scoring

## FR-1: Setup Interface - Player Name Input

### Scenario 1.1: Default Player Names
**Given** 用户打开五羽伦比配置页面  
**When** 页面加载完成  
**Then** 应显示A队5个输入框，默认值依次为A1、A2、A3、A4、A5  
**And** 应显示B队5个输入框，默认值依次为B1、B2、B3、B4、B5

### Scenario 1.2: Custom Player Names
**Given** 用户在A队第一个输入框中  
**When** 用户输入"张三"并失去焦点  
**Then** 该输入框的值应为"张三"  
**And** 后续比赛中应显示"张三"而非"A1"

## FR-2: Setup Interface - Server/Receiver Selection

### Scenario 2.1: Initial Server Selection
**Given** 用户在发球球员选择下拉框中  
**When** 用户查看可选项  
**Then** 应仅显示A1、A2、B1、B2四个选项

### Scenario 2.2: Receiver Selection - Server from Team A
**Given** 用户已选择A1作为发球球员  
**When** 用户打开接发球球员选择下拉框  
**Then** 应仅显示B1、B2为可选项  
**And** A1、A2、A3、A4、A5应被禁用或隐藏

### Scenario 2.3: Receiver Selection - Server from Team B
**Given** 用户已选择B2作为发球球员  
**When** 用户打开接发球球员选择下拉框  
**Then** 应仅显示A1、A2为可选项  
**And** B1、B2、B3、B4、B5应被禁用或隐藏

### Scenario 2.4: Dynamic Receiver Update (Scheme A)
**Given** 用户已选择A1作为发球球员，B1作为接发球球员  
**When** 用户将发球球员更改为B1  
**Then** 接发球球员应自动清空  
**And** 用户需重新从A1、A2中选择接发球球员

## FR-3: Setup Interface - Score Setting

### Scenario 3.1: Score Mode Selection
**Given** 用户在分数设置区域  
**When** 用户点击"50分"按钮  
**Then** "50分"按钮应高亮显示  
**And** "100分"按钮应变为非高亮状态  
**And** 比赛总分应设置为50

### Scenario 3.2: Default Score Mode
**Given** 用户首次打开配置页面  
**When** 页面加载完成  
**Then** 默认应选择50分模式

## FR-4: Match Start - Initial Positioning

### Scenario 4.1: Initial Court Positions
**Given** 用户配置A1发球、B1接发球  
**When** 比赛开始  
**Then** A1应在A队双数区  
**And** A2应在A队单数区  
**And** B1应在B队双数区  
**And** B2应在B队单数区

### Scenario 4.2: Server/Receiver Indicators
**Given** 比赛已开始  
**When** 查看比赛界面  
**Then** A1名字旁应显示"发"标识  
**And** B1名字旁应显示"接"标识

## FR-5: Scoring - Server Scores

### Scenario 5.1: Server Scores - Even to Odd
**Given** A1在双数区发球，当前比分为0:0  
**When** A队得分，比分变为1:0  
**Then** A队分数应为1  
**And** A1应移动到单数区（因为1是单数）  
**And** A2应移动到双数区  
**And** A1继续发球  
**And** B队位置不变

### Scenario 5.2: Server Scores - Odd to Even
**Given** A1在单数区发球，当前比分为1:0  
**When** A队得分，比分变为2:0  
**Then** A队分数应为2  
**And** A1应移动到双数区（因为2是双数）  
**And** A2应移动到单数区  
**And** A1继续发球

### Scenario 5.3: Receiver Determination After Server Scores
**Given** A1在双数区发球  
**When** A队得分后，A1移动到单数区  
**Then** 接发球人应从B队单数区球员中选择  
**And** 若B队单数区是B2，则接发球人应为B2

## FR-6: Scoring - Receiver Scores

### Scenario 6.1: Receiver Scores - Transfer Serve
**Given** A1发球，当前比分为0:0  
**When** B队得分，比分变为0:1  
**Then** B队分数应为1  
**And** 发球权转移给B队  
**And** 双方位置不变

### Scenario 6.2: New Server Selection Based on Parity
**Given** B队得分后比分为0:1（单数）  
**When** 确定新发球人  
**Then** 应从B队单数区球员中选择发球人  
**And** 若B队单数区是B2，则B2成为新发球人

### Scenario 6.3: New Receiver Determination
**Given** B2在单数区成为新发球人  
**When** 确定接发球人  
**Then** 应从A队单数区球员中选择接发球人  
**And** 若A队单数区是A2，则A2成为接发球人

## FR-7: Player Rotation - 10 Points

### Scenario 7.1: Rotation at 10 Points
**Given** 当前比分为9:8，场上球员为A1、A2 vs B1、B2  
**When** A队得分，比分变为10:8  
**Then** 应弹出换人弹窗  
**And** 弹窗应显示"A队：A1 下场 → A3 上场"  
**And** 弹窗应显示"B队：B1 下场 → B3 上场"  
**And** 比赛应暂停，等待用户确认

### Scenario 7.2: Position Reset After Rotation
**Given** 用户确认换人弹窗  
**When** 换人完成  
**Then** A3应在A队双数区（新上场）  
**And** A2应在A队单数区（剩余）  
**And** B3应在B队双数区（新上场）  
**And** B2应在B队单数区（剩余）

### Scenario 7.3: Server Assignment After Rotation
**Given** A队领先（10:8）  
**When** 换人完成后  
**Then** A队新上场球员A3应在双数区并发球  
**And** B队新上场球员B3应在双数区并接发球

## FR-8: Player Rotation - 20, 30, 40 Points

### Scenario 8.1: Rotation at 20 Points
**Given** 当前比分为19:17，场上球员为A2、A3 vs B2、B3  
**When** A队得分，比分变为20:17  
**Then** 应弹出换人弹窗  
**And** 弹窗应显示"A队：A2 下场 → A4 上场"  
**And** 弹窗应显示"B队：B2 下场 → B4 上场"

## FR-9: Match End - 50 Points Mode

### Scenario 9.1: Match Ends at 50 Points
**Given** 比赛模式为50分制，当前比分为49:45  
**When** A队得分，比分变为50:45  
**Then** 比赛应结束  
**And** A队应被判定为获胜方  
**And** 应显示最终比分50:45

## FR-10: Match End - 100 Points Mode

### Scenario 10.1: Continue Rotation Beyond 50 Points
**Given** 比赛模式为100分制，当前比分为49:45  
**When** A队得分，比分变为50:45  
**Then** 比赛不应结束  
**And** 应执行换人逻辑（同10分规则循环，50-60区间为A1,A2 vs B1,B2）

### Scenario 10.2: Match Ends at 100 Points
**Given** 比赛模式为100分制，当前比分为99:95  
**When** A队得分，比分变为100:95  
**Then** 比赛应结束  
**And** A队应被判定为获胜方

## FR-11: Court Visualization

### Scenario 11.1: Display Court Layout
**Given** 比赛正在进行  
**When** 查看比赛界面  
**Then** 应清晰显示A队双数区和单数区  
**And** 应清晰显示B队单数区和双数区  
**And** 每个区域内应显示对应球员名称

### Scenario 11.2: Real-time Position Updates
**Given** A1在双数区发球  
**When** A队得分  
**Then** A1应视觉上移动到单数区  
**And** A2应视觉上移动到双数区

## FR-12: Score History

### Scenario 12.1: Record Each Point
**Given** 比赛进行中  
**When** A队得分  
**Then** 得分历史应新增一条记录  
**And** 记录应包含序号、得分方、A队累计得分、B队累计得分

### Scenario 12.2: Display Scoring Side
**Given** 双打模式下A1和A2在场上  
**When** A队得分  
**Then** 得分历史中得分方应显示为"A1 / A2"
