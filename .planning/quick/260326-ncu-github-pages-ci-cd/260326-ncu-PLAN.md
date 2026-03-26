---
phase: quick-260326-ncu
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - vite.config.ts
  - .github/workflows/deploy.yml
autonomous: true
requirements: []
user_setup: []
must_haves:
  truths:
    - "推送代码后 GitHub Actions 自动触发构建"
    - "构建产物部署到 GitHub Pages"
    - "游戏可通过 GitHub Pages URL 访问"
  artifacts:
    - path: ".github/workflows/deploy.yml"
      provides: "CI/CD 工作流定义"
      contains: "jobs:"
    - path: "vite.config.ts"
      provides: "Vite 配置含 base 路径"
      contains: "base:"
  key_links:
    - from: ".github/workflows/deploy.yml"
      to: "GitHub Actions"
      via: "push 事件触发"
      pattern: "on:.*push"
    - from: "vite.config.ts"
      to: "构建产物"
      via: "base 配置"
      pattern: "base.*2048"
---

<objective>
配置 GitHub Actions CI/CD 工作流，实现推送到 master 分支时自动构建并部署到 GitHub Pages。

Purpose: 自动化部署流程，每次推送代码后无需手动操作即可更新线上版本。
Output: GitHub Actions 工作流文件 + 更新后的 Vite 配置
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@package.json
@vite.config.ts

## 项目信息

- **项目名称**: 2048
- **仓库地址**: https://github.com/rickx81/2048.git
- **技术栈**: Vue 3 + Vite + TypeScript
- **构建命令**: `npm run build` (包含 type-check + vite build)
- **Node 引擎**: ^20.19.0 || >=22.12.0

## GitHub Pages 配置要点

由于仓库 URL 为 `https://github.com/rickx81/2048.git`，GitHub Pages 部署后的访问地址为：
`https://rickx81.github.io/2048/`

因此需要配置 Vite 的 `base` 为 `/2048/`，确保静态资源路径正确。
</context>

<tasks>

<task type="auto">
  <name>Task 1: 配置 Vite base 路径</name>
  <files>vite.config.ts</files>
  <action>
    更新 vite.config.ts，添加 `base: '/2048/'` 配置。

    修改 `defineConfig` 配置对象，添加 base 属性：

    ```typescript
    export default defineConfig({
      base: '/2048/',
      plugins: [
        vue(),
        vueJsx(),
        vueDevTools(),
      ],
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url))
        },
      },
    })
    ```

    理由：GitHub Pages 部署在 `/2048/` 子路径下，需要确保所有静态资源（JS、CSS、图片）使用正确的相对路径。
  </action>
  <verify>
    <automated>grep -q "base: '/2048/'" vite.config.ts && echo "base 配置正确"</automated>
  </verify>
  <done>vite.config.ts 包含 base: '/2048/' 配置</done>
</task>

<task type="auto">
  <name>Task 2: 创建 GitHub Actions 部署工作流</name>
  <files>.github/workflows/deploy.yml</files>
  <action>
    创建 `.github/workflows/deploy.yml` 文件，配置 GitHub Actions 工作流：

    ```yaml
    # 将静态内容部署到 GitHub Pages 的工作流
    name: Deploy to GitHub Pages

    on:
      # 在推送到 master 分支时触发
      push:
        branches: ['master']
      # 允许手动触发
      workflow_dispatch:

    # 设置 GITHUB_TOKEN 的权限以允许部署到 GitHub Pages
    permissions:
      contents: read
      pages: write
      id-token: write

    # 只允许一个并发部署，跳过正在运行和最新排队之间的运行队列
    # 但是，不要取消正在进行的运行，因为我们希望让这些生产部署完成
    concurrency:
      group: 'pages'
      cancel-in-progress: true

    jobs:
      # 单次部署作业
      deploy:
        environment:
          name: github-pages
          url: \${{ steps.deployment.outputs.page_url }}
        runs-on: ubuntu-latest
        steps:
          - name: Checkout
            uses: actions/checkout@v4

          - name: Setup Node
            uses: actions/setup-node@v4
            with:
              node-version: '22'
              cache: 'npm'

          - name: Install dependencies
            run: npm ci

          - name: Build
            run: npm run build

          - name: Setup Pages
            uses: actions/configure-pages@v4

          - name: Upload artifact
            uses: actions/upload-pages-artifact@v3
            with:
              # 上传 dist 目录
              path: './dist'

          - name: Deploy to GitHub Pages
            id: deployment
            uses: actions/deploy-pages@v4
    ```

    工作流说明：
    - 触发条件：推送到 master 分支 或手动触发
    - 使用 Node 22（符合项目 engines 要求）
    - 执行 `npm ci` 安装依赖（比 npm install 更快更可靠）
    - 执行 `npm run build` 构建（包含类型检查）
    - 将 dist 目录上传并部署到 GitHub Pages
  </action>
  <verify>
    <automated>test -f .github/workflows/deploy.yml && grep -q "actions/deploy-pages" .github/workflows/deploy.yml && echo "工作流文件创建成功"</automated>
  </verify>
  <done>.github/workflows/deploy.yml 文件存在，包含完整的部署流程配置</done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>
    已完成：
    1. Vite 配置更新（base: '/2048/'）
    2. GitHub Actions 部署工作流创建
  </what-built>
  <how-to-verify>
    ### 步骤 1：启用 GitHub Pages
    1. 访问 https://github.com/rickx81/2048/settings/pages
    2. 在 "Build and deployment" > "Source" 下选择 **GitHub Actions**
    3. 保存设置

    ### 步骤 2：推送代码触发部署
    ```bash
    git add .
    git commit -m "ci: 配置 GitHub Pages 自动部署"
    git push origin master
    ```

    ### 步骤 3：查看部署状态
    1. 访问 https://github.com/rickx81/2048/actions
    2. 确认 "Deploy to GitHub Pages" 工作流运行成功（绿色勾）

    ### 步骤 4：验证线上访问
    访问 https://rickx81.github.io/2048/
    - 确认页面正常加载
    - 确认游戏可玩
    - 确认静态资源（样式、脚本）加载正常
  </how-to-verify>
  <resume-signal>输入 "approved" 确认部署成功，或描述遇到的问题</resume-signal>
</task>

</tasks>

<verification>
1. 本地验证：
   - `npm run build` 构建成功
   - dist/index.html 中的资源路径包含 `/2048/` 前缀

2. CI/CD 验证：
   - GitHub Actions 工作流运行成功
   - 部署完成无错误

3. 线上验证：
   - https://rickx81.github.io/2048/ 可访问
   - 游戏功能正常
</verification>

<success_criteria>
- [ ] vite.config.ts 包含 base: '/2048/' 配置
- [ ] .github/workflows/deploy.yml 文件存在且格式正确
- [ ] 推送代码后 GitHub Actions 自动触发
- [ ] 工作流执行成功（构建 + 部署）
- [ ] 游戏可通过 https://rickx81.github.io/2048/ 访问
</success_criteria>

<output>
完成后创建 `.planning/quick/260326-ncu-github-pages-ci-cd/260326-ncu-SUMMARY.md`
</output>
