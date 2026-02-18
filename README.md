# Latexia

Latexia 是一个面向学生、学术研究者和技术写作者的企业级 SaaS 风格 LaTeX 训练平台。

## 📚 文档

- [技术架构设计 (TDD)](./docs/TDD.md)
- [API 文档](./docs/API.md)

## 🚀 快速开始

### 1. 环境要求

- Node.js >= 20
- pnpm >= 9
- Docker & Docker Compose (可选，用于本地数据库)

### 2. 安装依赖

```bash
pnpm install
```

### 3. 配置环境变量

```bash
cp .env.example .env
```

### 4. 启动开发服务器

```bash
# 启动所有应用 (Web + API)
pnpm dev

# 仅启动前端
pnpm dev:web

# 仅启动后端
pnpm dev:api
```

## 🏗 项目结构

- `apps/web`: Next.js 前端应用
- `apps/api`: Hono 后端 API
- `packages/ui`: 共享 UI 组件库
- `packages/types`: 共享类型定义
- `packages/validators`: 共享校验 Schema
- `packages/config`: 共享基础设施配置

## 🤝 贡献

请阅读 [CONTRIBUTING.md](./docs/CONTRIBUTING.md) 了解如何参与贡献。
