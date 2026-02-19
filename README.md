<div align="center">

  <!-- 顶部大 Logo 区域：现代化高级风格 -->
  <div align="center" style="padding:48px 24px 32px;margin-bottom:8px;">
    <a href="./README.md" style="text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:20px;">
      <img src="apps/web/public/images/logo1.png" alt="Latexia" width="160" style="vertical-align:middle;border:none;box-shadow:none;outline:none;display:inline-block;" />
      <img src="apps/web/public/images/text.svg" alt="Latexia" height="72" style="vertical-align:middle;border:none;box-shadow:none;outline:none;display:inline-block;height:72px;width:auto;" />
    </a>
  </div>
  <p align="center" style="margin-top:0;margin-bottom:24px;">
    <a href="./README.md">中文文档</a> &nbsp;|&nbsp; <a href="./README_EN.md">English</a>
  </p>

</div>
<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14.2-000000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Hono-4.0-E36002?style=flat-square" alt="Hono" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-8+-336791?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Redis-7.x-DC382D?style=flat-square&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/version-1.0.0-blue?style=flat-square" alt="Version" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License" />
  <img src="https://img.shields.io/github/issues-pr/Auroral0810/LaTexia?style=flat-square" alt="Pull Requests" />
  <img src="https://img.shields.io/github/forks/Auroral0810/LaTexia?style=flat-square" alt="GitHub Forks" />
  <img src="https://img.shields.io/github/watchers/Auroral0810/LaTexia?style=flat-square" alt="Watchers" />
  <img src="https://img.shields.io/github/stars/Auroral0810/LaTexia?style=flat-square" alt="GitHub Stars" />
  <img src="https://img.shields.io/github/issues/Auroral0810/LaTexia?style=flat-square" alt="Issues" />
  <img src="https://img.shields.io/github/last-commit/Auroral0810/LaTexia?style=flat-square" alt="Last Commit" />
</p>





## ⚡️ 项目概述

**Latexia** 是一套面向学生、学术研究者和技术写作者的**在线 LaTeX 学习与练习平台**，采用 Monorepo 前后端分离架构，基于 **Next.js 14 + Hono + Drizzle ORM** 构建。系统支持**系统化教程**、**符号查询**、**题库练习**、**精选资源**、**排行榜**等核心能力，集成 KaTeX 即时公式渲染、CodeMirror 编辑、主题切换与 OpenAPI 接口文档等特性。

项目面向学术写作、技术文档与数学公式排版等场景，支持从入门到进阶的 LaTeX 学习路径、3000+ 符号检索与练习，并内置 API 文档（Swagger UI）、深色模式与响应式布局，适用于个人学习或团队内部分享部署。

---

## 📺 演示与截图

> 以下为占位说明，后续可替换为实际截图或演示视频。

<p align="center">
  <strong>首页 / 产品入口</strong><br />
  <em>（占位：可放置 static/首页.png 等截图）</em>
</p>

<p align="center">
  <strong>教学 / 符号 / 练习 页面</strong><br />
  <em>（占位：可放置 static/教学.png、static/符号.png、static/练习.png）</em>
</p>

---

## ✨ 功能特性

<div align="center">

| 核心能力           | 详细描述                                                                                           |
| :----------------- | :------------------------------------------------------------------------------------------------- |
| 系统化 LaTeX 教程  | 从文档结构、数学公式到表格与引用，分章节学习，支持 Markdown + KaTeX 渲染与代码高亮。               |
| 符号查询与练习     | 集成 3000+ LaTeX 符号，支持分类筛选与关键词搜索，卡片展示、复制与详情弹窗。                        |
| 题库练习           | 题目列表、分类筛选与题目详情页，结合即时反馈与解析（能力持续完善中）。                             |
| 精选资源           | 官方文档、在线编辑器、插件与工具等推荐列表，按分类展示，接口带缓存。                             |
| 排行榜             | 练习与竞赛相关排行榜展示（能力持续完善中）。                                                       |
| API 文档自动生成   | 基于 OpenAPI 3.0 + Swagger UI，接口文档与代码同源，支持在线调试。                                  |
| 深色模式           | 支持亮色/暗色主题切换，带左上角到右下角过渡动画。                                                 |
| 响应式与无障碍     | 适配桌面与移动端，语义化与基础无障碍支持。                                                         |

</div>

---

## 🏗️ 系统架构

### 整体架构说明

- **前端**：Next.js 14（App Router）、React 18、Tailwind CSS、Radix UI / 共享组件库 `@latexia/ui`。
- **后端**：Hono 4、Drizzle ORM、PostgreSQL、Redis（缓存与会话等）。
- **Monorepo**：pnpm workspace + Turbo，统一构建与脚本。

<div align="center">
  <em>（占位：可放置 static/整体架构图.png）</em>
</div>

---

### 1️⃣ 首页

- 产品 Slogan、核心功能入口、数据来源与「为什么选择我们」等模块（占位截图可放 `static/首页-门面.png` 等）。

---

### 2️⃣ 教学页

- 章节列表与小节内容，Markdown + KaTeX 公式渲染（占位：`static/教学.png`）。

---

### 3️⃣ 符号页

- 符号分类、搜索、分页与详情弹窗（占位：`static/符号.png`）。

---

### 4️⃣ 练习页

- 题目分类与题目列表（占位：`static/练习.png`）。

---

### 5️⃣ 资源 / 工具页

- 精选 LaTeX 工具与学习资源列表（占位：`static/资源.png`）。

---

### 6️⃣ API 文档

- Swagger UI：`http://localhost:3001/doc/ui`（占位：`static/API文档.png`）。

---

## 📁 项目代码结构

> 以下结构已排除 `node_modules`、`.next`、`.turbo`、`.env*` 等被 `.gitignore` 忽略的内容。

```
Latexia/
├── apps/
│   ├── web/                          # Next.js 前端
│   │   ├── src/
│   │   │   ├── app/                  # App Router 路由与布局
│   │   │   │   ├── (main)/           # 主布局：首页、练习、教学、符号、排行榜等
│   │   │   │   ├── (auth)/           # 登录、注册、忘记密码
│   │   │   │   ├── admin/            # 管理后台
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── not-found.tsx
│   │   │   │   ├── error.tsx
│   │   │   │   └── global-error.tsx
│   │   │   ├── components/           # 公共组件
│   │   │   │   ├── layout/           # Header、Footer
│   │   │   │   ├── learn/            # 教学相关
│   │   │   │   └── ui/               # 通用 UI
│   │   │   ├── data/                 # 静态数据（如章节）
│   │   │   ├── hooks/
│   │   │   ├── lib/
│   │   │   ├── store/
│   │   │   └── styles/
│   │   ├── public/
│   │   │   └── images/               # logo、插图等
│   │   ├── next.config.mjs
│   │   └── package.json
│   └── api/                          # Hono 后端 API
│       ├── src/
│       │   ├── db/                   # Drizzle 数据库与 Schema
│       │   ├── lib/                  # Redis 等
│       │   ├── modules/              # 业务模块
│       │   │   ├── tools/            # 精选资源（含 OpenAPI 路由）
│       │   │   └── symbols/          # 符号接口（含 OpenAPI 路由）
│       │   ├── openapi/              # 公共 OpenAPI Schema
│       │   └── index.ts              # 入口、/doc、/doc/ui
│       ├── package.json
│       └── drizzle.config.*
├── packages/
│   ├── ui/                           # 共享 UI 组件（Button、Card、Input 等）
│   ├── types/                        # 共享 TypeScript 类型
│   ├── validators/                   # 共享校验 Schema（Zod 等）
│   └── config/                       # 共享基础设施配置
├── docs/
│   ├── API.md                        # API 文档说明
│   └── TDD.md                        # 技术设计文档（若存在）
├── README.md
├── README_EN.md                      # 英文说明（占位）
├── CONTRIBUTING.md
├── package.json                      # 根 workspace 脚本
└── pnpm-workspace.yaml
```

---

## 🚀 快速开始

> [!IMPORTANT]
> 本项目为面向 LaTeX 学习与练习的开源平台，**仅供学习交流使用，严禁用于商业用途**。因商业用途产生的一切后果由使用者自行承担。

### 一、环境要求

#### 1.1 必需软件

| 软件       | 最低版本   | 说明           |
| :--------- | :--------- | :------------- |
| Node.js    | 20.x       | 推荐 20 LTS    |
| pnpm       | 9.x        | 包管理器       |
| PostgreSQL | 8.x（可选）| 后端持久化     |
| Redis      | 7.x（可选）| 缓存与会话等   |

#### 1.2 环境验证

```bash
node --version   # v20.x
pnpm --version  # 9.x
```

---

### 二、安装依赖

```bash
# 克隆仓库后进入项目根目录
cd Latexia

# 安装所有 workspace 依赖
pnpm install
```

---

### 三、配置环境变量

```bash
# 根目录（若存在）
cp .env.example .env

# 后端 API（若需连接数据库与 Redis）
cd apps/api && cp .env.example .env
# 编辑 .env，配置 DATABASE_URL、REDIS_URL 等
```

---

### 四、启动服务

需同时启动前端与后端（两个终端或使用根目录一键命令）。

**终端一 — 后端 API：**

```bash
pnpm dev:api
# 或：cd apps/api && pnpm dev
```

启动成功后：

- API：http://localhost:3001  
- OpenAPI JSON：http://localhost:3001/doc  
- Swagger UI：http://localhost:3001/doc/ui  

**终端二 — 前端 Web：**

```bash
pnpm dev:web
# 或：pnpm dev（会同时启动 web + api，视 turbo 配置而定）
```

启动成功后访问：http://localhost:3000  

---

### 五、验证安装

| 步骤 | 操作 | 预期结果 |
| :--- | :--- | :------- |
| 1 | 访问 http://localhost:3001 | 返回 API 欢迎 JSON |
| 2 | 访问 http://localhost:3001/doc/ui | 打开 Swagger UI 文档 |
| 3 | 访问 http://localhost:3000 | 显示 Latexia 首页 |
| 4 | 点击「教学」「符号」「练习」「资源」 | 对应页面正常展示 |

---

### 六、常见问题

| 问题 | 可能原因 | 处理建议 |
| :--- | :------- | :------- |
| 前端 404（localhost:3000） | 未启动 Web 应用 | 执行 `pnpm dev:web` 或 `pnpm dev` |
| API 无法访问 | 未启动 API | 执行 `pnpm dev:api` |
| Swagger UI 报错或空白 | 未启动 API 或端口不对 | 确认 http://localhost:3001/doc 可访问 |
| 数据库连接失败 | 未配置或未启动 PostgreSQL | 检查 `apps/api/.env` 中 `DATABASE_URL` |

---

## 📚 文档

- [API 文档说明](./docs/API.md)（含 Swagger UI 地址与本地启动方式）
- [技术架构设计 (TDD)](./docs/TDD.md)（若已存在）

---

## ⚠️ 免责声明

1. **用途**：本项目仅供学习、学术研究与技术交流，严禁用于任何商业用途或违法用途。
2. **合规**：使用者需遵守所在国家/地区法律法规及目标平台使用条款，因违规使用导致的后果由使用者自行承担。
3. **责任**：作者不对使用本项目造成的任何直接或间接损失承担责任；使用即表示接受上述条款。

---

## 📄 许可证

本项目采用 [MIT](LICENSE) 许可证（若仓库中为其他协议则以仓库为准）。

---

## 📞 联系

| 方式 | 说明 |
| :--- | :--- |
| 📧 Email | 15968588744@163.com |
| QQ | 1957689514 |
| 微信 | Luckff0810 |
| 博客 | [fishblog.yyf040810.cn](https://fishblog.yyf040810.cn) |

---

## 📈 Star History

<a href="https://www.star-history.com/#Auroral0810/LaTexia&type=date&legend=bottom-right">
  <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=Auroral0810/LaTexia&type=date&theme=light&legend=bottom-right" style="vertical-align:middle;display:inline-block;width:100%;max-width:800px;" />
</a>

---

## 📊 Repobeats 开发活跃度

![Alt](https://repobeats.axiom.co/api/embed/23097d8734915f0f304c8623f7430a21d4088b8b.svg "Repobeats analytics image")

<p align="center" style="margin-top:2em;">
  <strong>若本项目对你有帮助，欢迎在 GitHub 给一个 ⭐ Star 支持。</strong>
</p>
