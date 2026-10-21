# Aurora’s Research Workshop 运维手册

本手册用于在一台全新的 macOS、Linux 或 Windows 电脑上接管开发、验证和发布工作。仓库中的锁文件、Node 版本文件和 CI 工作流是跨电脑一致性的基准。

## 1. 首次接管

准备以下工具：

- Git；
- Node.js 24.22.0 LTS，推荐使用 nvm（macOS/Linux）或 fnm、mise（跨平台）；
- npm 10 或更高版本；
- 对 `chao126/aurora-research-workshop` 的 GitHub 写权限；
- 如需发布，对 `.openai/hosting.json` 中现有 Sites 项目的访问权限。

```bash
git clone https://github.com/chao126/aurora-research-workshop.git
cd aurora-research-workshop
nvm install
nvm use
npm ci
npm run check
npm run dev
```

Windows PowerShell 使用 fnm 时，可以执行：

```powershell
fnm install 24.22.0
fnm use 24.22.0
npm ci
npm run check
npm run dev
```

不要使用 `npm install` 随意重算依赖树；日常接管和 CI 使用 `npm ci`，确保严格遵循 `package-lock.json`。

## 2. 环境变量与密钥

本地演示无需任何密钥。需要连接外部服务时，复制示例文件：

```bash
cp .env.example .env.local
```

Windows PowerShell：

```powershell
Copy-Item .env.example .env.local
```

只在本地或托管平台的 Secret 设置中填写值。`.env.local` 已被 Git 忽略，不得提交 API Key。

| 变量 | 用途 | 是否敏感 |
| --- | --- | --- |
| `LLM_API_BASE` | 可选 LLM 接口地址 | 否 |
| `LLM_API_KEY` | LLM 凭据 | 是 |
| `CROSSREF_MAILTO` | Crossref 礼貌池联系邮箱 | 视邮箱而定 |
| `OPENALEX_API_KEY` | OpenAlex 凭据 | 是 |
| `SEMANTIC_SCHOLAR_API_KEY` | Semantic Scholar 凭据 | 是 |
| `ZOTERO_LIBRARY_ID` | Zotero Library 标识 | 否 |
| `ZOTERO_API_KEY` | Zotero 凭据 | 是 |
| `NEXT_PUBLIC_SITE_URL` | 站点规范公开地址 | 否；会暴露给浏览器 |

任何 `NEXT_PUBLIC_` 变量都不是秘密。密钥泄露时应立即在提供方撤销并轮换，而不是只从 Git 历史中删除。

## 3. 日常开发流程

```bash
git switch main
git pull --ff-only
git switch -c change/short-description
npm ci
npm run dev
```

修改完成后：

```bash
npm run check
git add -A
git commit -m "Describe the change"
git push -u origin change/short-description
```

从 GitHub 创建 Pull Request，等待 `Lint and build` 检查通过后再合并。若 `package-lock.json` 发生变化，必须与 `package.json` 一起评审和提交。

## 4. 自动验证

`.github/workflows/ci.yml` 在以下情况运行：

- 推送到 `main`；
- 面向 `main` 的 Pull Request；
- GitHub 页面手动触发。

CI 在干净的 Ubuntu 环境中安装锁定依赖，并依次执行 ESLint 和生产构建。本地的 `npm run check` 与 CI 使用同一入口；只有两者都通过，修改才具备可合并条件。

## 5. 发布与托管

`.openai/hosting.json` 已绑定现有 Sites 项目。为了避免创建重复站点：

1. 保留文件中的 `project_id`，不要在新电脑上重新初始化 Sites 项目；
2. 先合并至 `main` 并确认 GitHub CI 通过；
3. 在拥有该 Sites 项目权限的 Codex/ChatGPT 工作区中打开此仓库；
4. 从同一 `main` 提交执行 Sites 发布，并在发布后检查线上状态；
5. 托管密钥只写入 Sites Secret 设置，不写入仓库或 `.openai/hosting.json`。

本地构建产物位于 `dist/`，它属于生成物且已被 Git 忽略。不要手工提交 `dist/`、`.next/`、`.vinext/`、`.wrangler/` 或 `node_modules/`。

## 6. 回滚

优先使用可审计的反向提交，不要重写 `main` 历史：

```bash
git switch main
git pull --ff-only
git revert <problem-commit-sha>
npm ci
npm run check
git push origin main
```

CI 通过后重新发布该提交。若只是托管故障而源码未变，先检查 Sites 发布状态和 Secret 配置，不要无意义修改代码。

## 7. 数据边界与备份

当前 MVP 的交互状态保存在浏览器 `localStorage`，不会随 GitHub 仓库、登录账号或另一台电脑自动同步。换电脑维护源码不受影响，但浏览器里的演示会话不会迁移。

在引入服务端数据库前，应把本地状态视为可丢失的演示数据。重要研究材料必须保留在其原始来源或独立备份中，不应只存在于浏览器缓存。

## 8. 常见故障

- `npm ci` 报 Node 版本错误：确认 `node --version` 为 `v24.22.0`，重新执行版本管理器的安装与切换命令。
- 锁文件不一致：不要删除锁文件；先确认分支已更新，再仅在确实调整依赖时执行 `npm install` 并提交锁文件变化。
- `npm run check` 本地通过但 CI 失败：查看 GitHub Actions 的首个失败步骤，重点检查大小写敏感路径、未提交文件和环境变量依赖。
- 页面显示旧演示状态：清除该站点的 `localStorage`，或使用新的浏览器配置文件复测。
- 新电脑无法发布：确认 GitHub 权限和 Sites 项目权限均已授予；仅拥有仓库写权限并不自动拥有托管权限。
