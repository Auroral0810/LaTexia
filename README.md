<!-- Header：80% 宽度居中，左右留白对等 -->
<div style="width:80%;max-width:960px;margin-left:auto;margin-right:auto;text-align:center;box-sizing:border-box;">
  <img src="apps/web/public/images/header.svg" alt="Latexia" style="width:100%;height:auto;display:block;border:none;" />
  <p style="margin:1.5em 0 0.5em;">
    <strong><a href="./README.md">中文文档</a> · <a href="./README_EN.md">English</a></strong>
  </p>
  <p style="margin:1em 0 0;">
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
</div>

## ⚡️ 项目概述

**Latexia** 是一套面向学生、学术研究者和技术写作者的**全功能在线 LaTeX 学习与练习平台**，采用 Monorepo 前后端分离架构，基于 **Next.js 14 + Hono + Drizzle ORM** 构建。针对枯燥的学术公式排版入门痛点，Latexia 提供了一站式、游戏化、沉浸式的学习体验。

项目不仅支持完整的**系统化教程**与**题库练习**，还深度整合了包括**公式限时特训**、**LaTeX 草稿本**、**错题智能复习（艾宾浩斯）**、**学习排行与记录可视化**，甚至内置了护眼与伴学的**沉浸式音乐播放器**，帮助用户高效且愉悦地掌握学术排版精髓。

---

## 📺 演示与截图

### 🎥 运行视频演示

<div align="center">
  <p align="center">
    <em>（此处为演示视频占位符，可上传 Demo 视频至 static 并在此引用）</em>
  </p>
  <!-- [!TIP] 建议替换为 <video src="static/demo.mp4" controls width="80%"></video> -->
</div>

---

### 🌟 首页全景

<div align="center">
  <table>
    <tr>
      <td align="center"><img src="static/首页-顶部.png" /><br /><b>首页首屏 (英雄区)</b></td>
      <td align="center"><img src="static/首页-暗色.png" /><br /><b>深色模式支持</b></td>
    </tr>
    <tr>
      <td align="center"><img src="static/首页-中部.png" /><br /><b>核心功能板块</b></td>
      <td align="center"><img src="static/首页-底部.png" /><br /><b>页脚与社交链接</b></td>
    </tr>
  </table>
</div>

---

### 📚 学习与教学

<div align="center">
  <table>
    <tr>
      <td align="center"><img src="static/教学页面.png" /><br /><b>章节教程内容页</b></td>
      <td align="center"><img src="static/符号-搜索高量.png" /><br /><b>符号库即时搜索</b></td>
    </tr>
    <tr>
      <td align="center"><img src="static/资源页面.png" /><br /><b>LaTeX 外部资源导航</b></td>
      <td align="center"><img src="static/关于.png" /><br /><b>关于我们与联系方式</b></td>
    </tr>
  </table>
</div>

---

### 📝 题库与训练

<div align="center">
  <table>
    <tr>
      <td align="center"><img src="static/训练-题库页面.png" /><br /><b>题库分类列表</b></td>
      <td align="center"><img src="static/练习-题目页面.png" /><br /><b>题目详情与在线练习</b></td>
    </tr>
    <tr>
      <td align="center"><img src="static/公式训练页面.png" /><br /><b>限时公式速记特训</b></td>
      <td align="center"><img src="static/Latex公式编辑器.png" /><br /><b>LaTeX 草稿本 (可视化编辑)</b></td>
    </tr>
  </table>
</div>

---

### 📊 个人中心与特色功能

<div align="center">
  <table>
    <tr>
      <td align="center"><img src="static/错题复习.png" /><br /><b>艾宾浩斯错题复习</b></td>
      <td align="center"><img src="static/我的收藏.png" /><br /><b>个人收藏夹中心</b></td>
    </tr>
    <tr>
      <td align="center"><img src="static/排行榜页面.png" /><br /><b>全站排名与成就</b></td>
      <td align="center"><img src="static/音乐播放器.png" /><br /><b>沉浸式音乐播放器</b></td>
    </tr>
  </table>
</div>

---

### 🔐 账号与认证

<div align="center">
  <table>
    <tr>
      <td align="center"><img src="static/登录页面.png" /><br /><b>简约登录界面</b></td>
      <td align="center"><img src="static/注册页面.jpeg" /><br /><b>新用户注册流程</b></td>
    </tr>
  </table>
</div>

---

## ✨ 功能特性

<div align="center">

| 核心能力            | 详细描述                                                                                                         |
| :------------------ | :--------------------------------------------------------------------------------------------------------------- |
| **刷题训练**        | 提供海量 LaTeX 练习题库，按难度与领域分类，结合即时验证与深度解析，支持每日一题（Daily Problem）。               |
| **教学模块**        | 从文档结构到复杂高数公式，系统划分章节。支持带右侧大纲的 Markdown + KaTeX 沉浸式阅读，知识点与代码高亮无缝衔接。 |
| **公式训练**        | 专为高效速记打造的限时特训模式，涵盖不同数学与物理领域的 **3000+** 常用公式，提供计时与准确率统计。              |
| **收藏夹功能**      | 一键收藏疑难题目或高频公式，支持自定义文件目录管理与分类检索。                                                   |
| **错题复习**        | 基于用户的答题历史，自动归档错题。引入艾宾浩斯记忆曲线算法，智能推荐每日最佳复习计划。                           |
| **LaTeX 草稿本**    | 类似 MathType 的可视化/快捷公式实验画板，实时渲染预览，一键提取纯正 LaTeX 代码。                                 |
| **排行榜**          | 多维度榜单系统（总榜、刷题榜、正确率等），激发个人与团队学习动力。                                               |
| **学习记录可视化**  | 通过直观的图表展示用户的每日刷题热力图、知识点掌握雷达图及成长轨迹。                                             |
| **符号查询**        | 庞大且分类详尽的符号字典，支持关键词检索、一键复制与详细使用样例弹窗。                                           |
| **资源页面**        | 精选学术协作平台、官方文档、高效工具软件，构建完整的 LaTeX 生态导航站。                                          |
| **音乐播放器**      | 平台底部内嵌炫酷的极简沉浸式音乐播放器！支持网易云精选环境歌单与滚动悬浮歌词，让学习不再枯燥。                   |
| **i18n 国际化支持** | 全局中英双语无缝切换，惠及海内外开发者与学术群体。                                                               |
| **主题色切换**      | 完美适配亮色/暗黑主题（深色模式），带丝滑的系统级切换动画与持久化。                                              |
| **多种第三方登录**  | 接入 GitHub、Google 等主流账号的一键授权体系，告别繁琐注册。                                                     |

</div>

---

## 🏗️ 系统架构

### 整体架构说明

- **前端**：Next.js 14（App Router）、React 18、Tailwind CSS、Radix UI / 共享组件库 `@latexia/ui`。
- **后端**：Hono 4、Drizzle ORM、PostgreSQL、Redis（缓存与会话等）。
- **Monorepo**：pnpm workspace + Turbo，统一构建与脚本。

<div align="center">
  <img src="static/系统架构图.png" alt="Latexia Architecture" />
  <p align="center"><b>Latexia 系统架构图</b></p>
</div>

---

## 📁 项目代码结构

> 以下结构已排除 `node_modules`、`.next`、`.turbo`、`.env*` 等被 `.gitignore` 忽略的内容。

```text
Latexia/
├── apps/
│   ├── web/                          # Next.js 前端应用 (App Router)
│   │   ├── src/
│   │   │   ├── app/                  # 包含各功能模块页面布局 (auth, learn, practice, profile 等)
│   │   │   ├── components/           # 页面级拆分组件与统一样式 (layout, ui, learn, etc)
│   │   │   ├── hooks/                # 自定义 React Hooks
│   │   │   ├── lib/                  # 全局工具、API 客户端封装与配置文件
│   │   │   └── store/                # 全局状态管理 (Zustand)
│   │   ├── public/                   # 静态图片或视频资源
│   │   └── next.config.mjs
│   └── api/                          # Hono 后端微服务
│       ├── src/
│       │   ├── db/                   # Drizzle 数据库连接配置与 Schema 定义
│       │   ├── lib/                  # 第三方依赖封装 (Redis, 鉴权, Cache)
│       │   ├── modules/              # 核心业务路由与控制器 (users, problems, bookmarks, leaderboard 等)
│       │   ├── openapi/              # OpenAPI 文档自动生成支持
│       │   └── index.ts              # 系统服务启动入口起点
│       └── drizzle.config.ts
├── packages/
│   ├── ui/                           # 企业级共享基础 UI 组件库 (基建于 Radix / Tailwind)
│   ├── types/                        # 跨端共享 TS 类型定义
│   ├── validators/                   # 跨端共享数据结构校验器 (Zod)
│   └── config/                       # 共享的统一 ESLint / TSConfig / Tailwind 预设
├── scripts/                          # 项目级自动化运维、清理及数据处理脚本
├── docs/                             # 开发指南与规范文档
├── package.json                      # Turbo 根目录协同脚本
└── pnpm-workspace.yaml
```

---

## 🚀 完整部署指南

本项目采用前后端分离，完全依赖 Node 环境。如果您是在一台没有任何环境的全新电脑上，请遵循以下流程逐一安装组件，即可让 Latexia 平稳跑起来！

### 一、基础环境准备

#### 1.1 安装 NVM & Node.js

为了更好地管理 Node 版本，推荐您首先安装 NVM (Node Version Manager)。

- **Windows**: 前往 [nvm-windows Releases](https://github.com/coreybutler/nvm-windows/releases) 下载 `nvm-setup.exe` 并安装。
- **macOS/Linux**: 在终端运行下述命令安装：
  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
  ```
  安装完成后重启您的终端，然后安装并切换到推荐的 `20.x` LTS 环境：

```bash
nvm install 20
nvm use 20
node -v  # 应输出 v20.x
```

#### 1.2 安装 pnpm

本项目强制要求使用 `pnpm` workspace：

```bash
npm install -g pnpm
pnpm -v  # 应输出 9.x
```

#### 1.3 安装 PostgreSQL 数据库

- **Windows/macOS**: 建议直接下载 [PostgreSQL 官方安装包](https://www.postgresql.org/download/) 或使用 [Postgres.app (仅 macOS)](https://postgresapp.com/)。
- **Docker 快速方案 (推荐)**: 如果有 Docker 环境，可直开一个 PG 容器：
  ```bash
  docker run --name latexia-pg -e POSTGRES_PASSWORD=your_password -p 5432:5432 -d postgres
  ```

#### 1.4 安装 Redis 缓存

- **Windows**: 推荐下载 [Memurai](https://www.memurai.com/) (Windows原生Redis兼容) 或使用 WSL 安装。
- **macOS**: `brew install redis` 即可，随后执行 `brew services start redis`。
- **Docker 快速方案**:
  ```bash
  docker run --name latexia-redis -p 6379:6379 -d redis
  ```

---

### 二、数据库拉取与初始化脚本

为了提供零门槛的使用体验，我们在开源版中为您准备了核心结构及题库基础数据 `SQL` 脚本。

1. **创建数据库**:
   您可以通过 PgAdmin、DBeaver 等可视化工具，或者使用 `psql` 命令行工具，连接您的 PostgreSQL 服务，并创建一个名为 `latexia` 的数据库。
   ```sql
   CREATE DATABASE latexia;
   ```
2. **导入初始化数据**:
   获取我们在 Release 中提供的 `latexia_init.sql` (或随包附带)，并导入此数据库内：
   ```bash
   psql -U postgres -d latexia -f ./path/to/latexia_init.sql
   ```

_(如自行使用 Drizzle 维护，也可通过下述的 `db:generate` 和 `db:migrate` 向空库推送表结构)_

---

### 三、配置项目与启动

#### 3.1 拉取代码并安装依赖项

```bash
git clone https://github.com/Auroral0810/LaTexia.git
cd Latexia
pnpm install
```

#### 3.2 配置环境变量 (`.env`)

您需要在项目后端的对应目录注入私密环境。

```bash
cd apps/api
cp .env.example .env
```

用编辑器打开 `apps/api/.env`，确保数据库及 Redis 地址正确。示例如下：

```env
# ===================
# 数据库配置
# ===================
DATABASE_URL=postgresql://latexia:latexia_password@localhost:5432/latexia

# ===================
# Redis 配置
# ===================
REDIS_URL=redis://localhost:6379

# ===================
# JWT 密钥
# ===================
JWT_ACCESS_SECRET=your-access-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-key-here

# ===================
# OAuth 配置
# ===================
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
APPLE_CLIENT_ID=
APPLE_CLIENT_SECRET=

# ===================
# MinIO / S3 配置
# ===================
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minio_access_key
MINIO_SECRET_KEY=minio_secret_key
MINIO_BUCKET=latexia

# ===================
# 邮件配置
# ===================
MAIL_HOST=smtp.163.com
MAIL_PORT=465
MAIL_USERNAME=************@163.com
MAIL_PASSWORD=************
MAIL_FROM=************@163.com
MAIL_FROM_NAME=Latexia
MAIL_USE_SSL=true

# ===================
# 短信配置
# ===================
SMS_PROVIDER=aliyun
SMS_ACCESS_KEY=
SMS_SECRET_KEY=
SMS_SIGN_NAME=
SMS_TEMPLATE_CODE=

# ===================
# 应用配置
# ===================
NODE_ENV=development
PORT=3001
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001

# ================
# Aliyun OSS
# ================

OSS_ACCESS_KEY_ID=LTAI5************4hYuhUEG4
OSS_ACCESS_KEY_SECRET=RRxg1d************Zm7L1kcdpbl
OSS_ENDPOINT=oss-cn-beijing.aliyuncs.com
OSS_BUCKET_NAME=************
OSS_URL=https://************.oss-cn-beijing.aliyuncs.com
```

如果您还保留着默认的主目录 `.env` 变量定义，同样可根据 `.env.example` 补全需要的 GitHub 或 Google Client Secrets 用于 OAuth 登录。

#### 3.3 本地构建与启动服务

在终端退回到项目的**根目录**，即可用 Turbo 启动微前端和微服务架构：

```bash
# 回到项目根目录
cd ../../

# 全局一键启动前端 (Web) 与 后端 (API)
pnpm run dev
```

> 如果您喜欢拆分查看终端日志：
>
> - 终端 A: `pnpm run dev:api`
> - 终端 B: `pnpm run dev:web`

**验证一切正常**：

1. 访问 **http://localhost:3001/doc/ui**，若能看到 Swagger 的接口面板，说明您的后端服务与数据库均已连通！
2. 访问 **http://localhost:3000**，开启您的 Latexia 前端之旅！🎉

---

## ⚠️ 免责声明

1. **用途**：本项目仅供学习、学术研究与技术交流，严禁用于任何商业用途或违法用途。
2. **合规**：使用者需遵守所在国家/地区法律法规及目标平台使用条款，因违规使用导致的后果由使用者自行承担。
3. **责任**：作者不对使用本项目造成的任何直接或间接损失承担责任；使用即表示接受上述条款。

---

## 📄 许可证

本项目采用 [MIT](LICENSE) 许可证。

---

## 📞 联系

| 方式  | 说明                                                   |
| :---- | :----------------------------------------------------- |
| Email | 15968588744@163.com                                    |
| QQ    | 1957689514                                             |
| 微信  | Luckff0810                                             |
| 博客  | [fishblog.yyf040810.cn](https://fishblog.yyf040810.cn) |

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
