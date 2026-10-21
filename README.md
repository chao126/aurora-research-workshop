# Aurora’s Research Workshop MVP

一个以研究任务为中心的个人 AI 学术推理工作台。当前版本是可运行、可编辑、可完整演练主流程的交互型 MVP。

## 当前可验证的主链

1. 材料驱动 / 导师命题双模式新建会话。
2. 导师命题必须先解析，并由用户确认。
3. Source 层分开 Role、Importance 与 Verification，支持用户锁定。
4. 书籍必须明确选择阅读范围，不直接执行整书摘要。
5. Synthesis 显示比较矩阵、争议、未解问题与带 Basis 的文献关系。
6. Discover 使用 Verify → Match → Importance → Human review 顺序。
7. Connect 中的已知、假设、替代解释和待验证证据均可编辑、锁定。
8. Compose 必须先批准 Argument，再生成 Quick / Full，Full 附 Claim Audit 和 Contested Claim 检查。
9. Zotero 仅作为精选输入与输出，候选来源不会被自动写入。

## 在任意电脑上开始维护

前置条件：Git、Node.js 24.22.0 LTS（仓库内的 `.nvmrc` / `.node-version` 会帮助版本管理器自动选择）以及 npm 10 或更高版本。

```bash
git clone https://github.com/chao126/aurora-research-workshop.git
cd aurora-research-workshop
nvm install
nvm use
npm ci
npm run check
npm run dev
```

Windows 可使用支持 `.node-version` 的 fnm 或 mise 安装相同 Node 版本。默认预览地址为 `http://localhost:3000/`。

日常修改应从新分支开始，提交前执行 `npm run check`，再通过 Pull Request 合并至 `main`。GitHub Actions 会在每次推送和 Pull Request 中重复执行相同检查。

完整的环境变量、发布、回滚和故障排查流程见 [`docs/OPERATIONS.md`](docs/OPERATIONS.md)。

生产构建：

```bash
npm run build
```

## 数据与外部服务边界

- 交互修改目前保存在当前浏览器的 `localStorage`，方便无凭据评审。
- 页面中的文献记录是透明标注的演示数据，不代表实时 Crossref / OpenAlex 核验。
- Crossref、OpenAlex、Semantic Scholar、LLM 与 Zotero 的边界由 `lib/providers.ts` 中的接口隔离。
- 未配置已授权数据源时，JIF、引用量、DOI 状态等未知信息保持为未知。
- 上传控件已建立完整状态边界，但本演示版未将本地文件传到外部服务。

完整需求见上一级目录中的 `赵晨曦 MVP Product Spec v1.0.md`。
