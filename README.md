# 羽毛球计分器

一款简洁美观的羽毛球计分小程序，支持单打、双打和五羽伦比三种比赛模式。

## 功能特点

### 三种比赛模式

- **单打模式**：1v1 单人比赛，适合日常练习和对战
- **双打模式**：2v2 双人比赛，支持发球方和接发球方自动跟踪
- **五羽伦比**：5v5 五人团体赛，带有独特的换人机制

### 核心功能

- 实时计分显示
- 发球方/接发球方自动跟踪
- 比赛历史记录
- 五羽伦比模式自动换人提醒
- 支持15分制、21分制加分/不加分规则

## 快速开始

### 环境要求

- Node.js v18 或更高版本
- npm 或 yarn

### 安装步骤

```bash
# 克隆项目
git clone <项目地址>
cd badminton-score-app

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 使用方法

1. 打开浏览器访问 `http://localhost:5173/`
2. 选择比赛模式（单打/双打/五羽伦比）
3. 进入配置页面，填写选手/队伍信息
4. 点击"开始比赛"进入计分页面
5. 点击对应按钮为队伍加分
6. 比赛结束后可查看得分历史

## 项目结构

```
badminton-score-app/
├── src/
│   ├── components/          # React 组件
│   │   ├── ModeSelect.tsx   # 模式选择页面
│   │   ├── SinglesSetup.tsx    # 单打配置
│   │   ├── SinglesMatch.tsx    # 单打比赛
│   │   ├── DoublesSetup.tsx    # 双打配置
│   │   ├── DoublesMatch.tsx    # 双打比赛
│   │   ├── WuYunLunBiSetup.tsx # 五羽伦比配置
│   │   └── WuYunLunBiMatch.tsx # 五羽伦比比赛
│   ├── types/               # TypeScript 类型定义
│   │   └── index.ts
│   ├── utils/               # 工具函数
│   │   └── scoring.ts       # 计分逻辑
│   └── App.tsx              # 主应用组件
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 技术栈

- **前端框架**：React 18 + TypeScript
- **构建工具**：Vite
- **样式**：TailwindCSS
- **语言**：TypeScript

## 计分规则

### 单打/双打

- 21分制：先得21分者获胜（不加分）
- 21分制（加分）：20平后，先领先2分者获胜
- 15分制：先得15分者获胜（不加分）
- 15分制（加分）：14平后，先领先2分者获胜

### 五羽伦比

- 50分制或100分制
- 每得1分即得1分，不加分
- 特殊换人机制：当任意队伍得分达到特定阈值时，场外候补选手替换场上选手

## 许可

MIT License
