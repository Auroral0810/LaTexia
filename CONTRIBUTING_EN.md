# Contributing Guide

Thank you for your interest in contributing to Latexia! We welcome contributions from the community.

## 🚀 Getting Started

### 1. Fork the Repository

Click the **Fork** button at the top-right corner of the page to fork the repository.

### 2. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/LaTexia.git
cd LaTexia
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 5. Development

```bash
# Start development servers
pnpm dev

# Frontend: http://localhost:3000
# Backend:  http://localhost:3001
```

### 6. Commit Your Changes

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```bash
git commit -m "feat: add new practice category"
git commit -m "fix: resolve formula rendering issue"
git commit -m "docs: update API documentation"
```

Common prefixes:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style (formatting, no functional change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build/tooling changes

### 7. Submit a Pull Request

Push your branch to GitHub and create a Pull Request.

```bash
git push origin feature/your-feature-name
```

## 📝 Code Style

- **Language**: TypeScript
- **Indentation**: 2 spaces
- **Quotes**: Single quotes
- **Semicolons**: Required
- **Comments**: Chinese (for this project)

## 🏗 Project Structure

```
Latexia/
├── apps/
│   ├── web/          # Next.js Frontend
│   └── api/          # Hono Backend API
├── packages/
│   ├── ui/           # Shared UI Components
│   ├── types/        # Shared Type Definitions
│   ├── validators/   # Validation Schemas
│   └── config/       # Shared Configuration
├── infra/            # Docker, Nginx
└── docs/             # Documentation
```

## 🐛 Reporting Bugs

Please report bugs via [GitHub Issues](https://github.com/Auroral0810/LaTexia/issues). Include:

1. A brief description of the problem
2. Steps to reproduce
3. Expected vs actual behavior
4. Screenshots (if applicable)
5. Environment details (OS, browser, Node.js version)

## 💡 Feature Requests

Feature requests are welcome via [GitHub Issues](https://github.com/Auroral0810/LaTexia/issues).

## 📬 Contact

- **Email**: 15968588744@163.com
- **QQ**: 1957689514
- **WeChat**: Luckff0810
- **Blog**: [fishblog.yyf040810.cn](https://fishblog.yyf040810.cn)

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

---

Thank you for contributing! 🎉
