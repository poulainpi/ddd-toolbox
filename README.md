<div align="center">
    <h2>
        <img src="apps/ddd-toolbox/public/logo.svg" alt="DDD Toolbox Logo" width="32" height="32"> DDD Toolbox
    </h2>
</div>

<div align="center">
    <h3>
        一站式领域驱动设计（DDD）战略设计工具集，帮助你梳理复杂业务领域、组织协作式工作坊，并在组织内建立共同的领域认知。
    </h3>
    <p>
        <a href="https://dddtoolbox.com/domain-storytelling">在线体验 Domain Storytelling →</a>
        <br>
        <a href="https://dddtoolbox.com/event-storming">在线体验 Event Storming →</a>
        <br>
        <a href="https://dddtoolbox.com/bounded-context-canvas">在线体验 Bounded Context Canvas →</a>
    </p>
    <p>
        简体中文 | <a href="./README.en.md">English</a>
    </p>
</div>

## 关于

DDD Toolbox 是一套面向领域驱动设计实践者的战略设计工具。无论你是在做协作式工作坊、划分领域边界，还是记录复杂的业务流程，这些工具都能帮助业务专家和研发团队跨越语言与视角的鸿沟，建立共享的领域模型。

项目是**纯静态 Web 应用**：没有后端、没有数据库、没有账号体系。你可以直接使用官方托管版，也可以完全自托管（见 [Docker 部署](#docker-部署)）。

## 功能

### 已上线

- **[Domain Storytelling（领域故事讲述）](https://dddtoolbox.com/domain-storytelling)** — 用讲故事的方式把领域知识画成图形化模型，让业务专家和研发团队在同一张图上对话。
  ![Demo](https://i.imgur.com/OgES8P8.gif)
- **[Event Storming（事件风暴）](https://dddtoolbox.com/event-storming)** — 通过协作式工作坊快速发现业务流程、识别领域事件和领域边界。
  ![Demo](https://i.imgur.com/P3yrtU9.png)
- **[Bounded Context Canvas（限界上下文画布）](https://dddtoolbox.com/bounded-context-canvas)** — 用结构化画布记录和设计限界上下文，沉淀业务模型、统一语言和集成模式。
  ![Demo](https://i.imgur.com/oSk4SjL.png)

### 规划中

- **Context Mapping（上下文映射）** — 定义并可视化限界上下文之间的关系，理解集成模式和团队协作方式。
- **Aggregate Design Canvas（聚合设计画布）** — 用结构化画布设计聚合，明确聚合边界、不变式和业务行为。
- **Domain Message Flow（领域消息流）** — 建模系统各部分之间的消息与事件流转，可视化信息如何跨上下文传递。

## 技术栈

| 类别 | 选型 |
| --- | --- |
| 前端框架 | Astro 5（Islands 架构）+ React 19 |
| 语言 | TypeScript 5.9 |
| 样式 | Tailwind CSS 4 + tailwindcss-animate |
| 组件 | Radix UI 原语 + shadcn/ui 模式 |
| 画布 | tldraw 4 |
| 构建 / Monorepo | Nx 21 + Vite 7 |
| 测试 | Vitest（单元）、Playwright（E2E） |
| 包管理 | pnpm |

## 快速开始

### 环境要求

- **Node.js** 22 或更高版本（已验证 24）
- **pnpm** 10 或更高版本（已验证 12）
- **Docker** + Compose v2（可选，仅容器化部署需要）

### 安装依赖

```bash
pnpm install
```

根目录的 `postinstall` 会顺带安装 `apps/ddd-toolbox` 下的应用依赖。

> **注意：** pnpm 10+ 默认禁止执行依赖的生命周期脚本。本仓库通过 `apps/ddd-toolbox/pnpm-workspace.yaml` 放行了 `esbuild` 和 `sharp` 的原生构建。如果你仍然遇到 `ERR_PNPM_IGNORED_BUILDS`，请在 `apps/ddd-toolbox` 目录执行 `pnpm approve-builds` 并勾选这两个包。

### 启动开发服务器

```bash
npx nx dev ddd-toolbox
```

或者直接进入应用目录：

```bash
cd apps/ddd-toolbox
pnpm dev
```

默认地址为 <http://localhost:4321>。如果需要在局域网内访问：

```bash
cd apps/ddd-toolbox
pnpm exec astro dev --host 0.0.0.0 --port 4321
```

### 构建与预览

```bash
npx nx build ddd-toolbox     # 静态产物输出到 apps/ddd-toolbox/dist
npx nx preview ddd-toolbox   # 本地预览生产构建
```

### 环境变量（可选）

把 `apps/ddd-toolbox/.env.example` 复制为 `apps/ddd-toolbox/.env`，按需填写：

| 变量 | 用途 |
| --- | --- |
| `TLDRAW_LICENSE_KEY` | 去掉 tldraw 画布水印 |
| `UMAMI_WEBSITE_ID` | 启用 Umami 访问统计 |

不配置也能正常运行：画布会显示 tldraw 水印，且不会上报统计。

## Docker 部署

仓库自带多阶段 `Dockerfile`：先用 Node 构建静态站点，再由 nginx 提供服务。最终镜像约 84 MB，不需要挂载任何卷。

### 使用 Docker Compose（推荐）

```bash
docker compose up -d --build
```

启动后访问 <http://localhost:4322>。端口映射写在 `docker-compose.yml` 中；如果该端口被占用，改成 `"8080:80"` 或 `"80:80"` 即可。

常用命令：

```bash
docker compose ps        # 查看状态（健康检查通过时显示 healthy）
docker compose logs -f   # 跟踪日志
docker compose down      # 停止并删除容器
```

### 直接使用 Docker

```bash
docker build -t ddd-toolbox .
docker run -d --name ddd-toolbox --restart unless-stopped -p 4322:80 ddd-toolbox
```

### 镜像做了什么

- 构建阶段使用 `node:24-slim` + pnpm，分别安装根目录和应用目录依赖，避开仓库 `postinstall` 里的嵌套安装。
- 运行阶段使用 `nginx:1.27-alpine`，只复制 `apps/ddd-toolbox/dist`。
- `docker/nginx.conf` 将无扩展名 URL 映射到 Astro `format: 'file'` 生成的 `.html`（例如 `/domain-storytelling` → `domain-storytelling.html`），开启 gzip，并为 `/_astro/` 添加长期缓存。
- 内置 `HEALTHCHECK`，nginx 可访问后容器状态会变为 `healthy`。

## 常用命令

| 目的 | 命令 |
| --- | --- |
| 启动开发服务器 | `npx nx dev ddd-toolbox` |
| 构建生产版本 | `npx nx build ddd-toolbox` |
| 预览生产构建 | `npx nx preview ddd-toolbox` |
| 运行单元测试 | `npx nx test <project-name>` |
| 运行 E2E 测试 | `npx nx e2e ddd-toolbox-e2e` |
| 代码检查 | `npx nx lint <project-name>` |
| 格式化 | `npx nx format:write` |
| 查看依赖图 | `npx nx graph` |

> 说明：`typecheck` 目标目前被禁用（某些 project reference 设置了 `noEmit: true`），这是仓库现状；需要类型检查时可对具体项目执行 `npx tsc -p <tsconfig>`。

## 项目结构

```text
apps/
  ddd-toolbox/                     主站（Astro + React）
  ddd-toolbox-e2e/                 Playwright 端到端测试
libs/
  feature-domain-storytelling/     Domain Storytelling 功能
  feature-event-storming/          Event Storming 功能
  feature-bounded-context-canvas/  Bounded Context Canvas 功能
  shared-canvas/                   画布与文档持久化等共享逻辑
  ui/                              Radix UI + Tailwind 组件
  util/                            通用工具函数
docs/
  agents/                          供 AI 编码代理使用的协作说明
```

## 数据与隐私

- 应用没有后端，图表数据不会上传到任何服务器。
- 打开/保存通过浏览器的 File System Access API 读写本地 `.json` 文件（不支持该 API 的浏览器会退化为下载/上传文件）。
- 只有在配置了 `UMAMI_WEBSITE_ID` 时才会加载统计脚本；自托管时完全可以不配置。

## 为什么需要它

- **远程/混合办公**让传统纸笔工作坊难以组织；
- **纸质产出**难以评审、迭代和分发给分布式团队；
- **通用白板工具**缺少 DDD 战略设计所需的语义和约束。

现有协作工具和付费白板模板不少，但缺少真正为 DDD 战略设计打造的工具：懂 DDD 概念、遵循成熟工作坊流程、便于反复迭代，并且免费开源。DDD Toolbox 就是为了填补这个空白。

## 参与贡献

- 提交信息遵循 Conventional Commits（`feat:`、`fix:`、`docs:` 等）。
- 仓库配置了 Husky + lint-staged，提交时会自动对改动文件执行 lint 和格式化。
- 提交 PR 前建议至少跑一遍 `npx nx affected -t lint test build`（CI 也是这么做的）。
- 更详细的架构与开发约定见 `CLAUDE.md` 和 `docs/agents/`。

## 许可证

本项目采用 **AGPL-3.0** 许可证，详见 [LICENSE](./LICENSE)。

> 注：`package.json` 中的 `license` 字段目前仍写着 `MIT`，与 LICENSE 文件不一致，属于上游遗留问题，以 LICENSE 文件为准。

## 链接

- 线上站点：<https://dddtoolbox.com>
- 上游仓库：<https://github.com/poulainpi/ddd-toolbox>
- 问题反馈：<https://github.com/poulainpi/ddd-toolbox/issues>
