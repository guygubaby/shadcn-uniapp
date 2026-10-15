# Cloudflare GitHub 部署

目标仓库：https://github.com/guygubaby/shadcn-uniapp

目标域名：https://shadcn-uniapp.guygubaby.top

本项目是静态 Vue SPA，H5 预览和 Registry 在同一次构建中生成，无业务后端、数据库或认证服务。

## 构建配置

使用 Cloudflare Pages GitHub 集成，静态资源无需 Worker 或 Wrangler 配置。

- 生产分支：`main`
- 根目录：仓库根目录
- 安装：`pnpm install --frozen-lockfile`
- 构建命令：`pnpm build`
- 输出目录：`apps/site/dist`
- Node：`24.13.0` 或兼容的 Node 24.x
- pnpm：`10.32.1`（见 packageManager 字段）

不要只构建 apps/site：它依赖先构建的 npm 工具包、Registry 和 uni-app H5 预览。Cloudflare 通过 GitHub 集成监听 main；不需要把 Cloudflare 或 npm 的凭证提交到仓库。

## 路由和缓存

站点提供 SPA fallback，支持直接刷新 /create、/creator、/blocks 和 /docs。/preview/index.html 为真实的隔离 H5 应用；/r/_.json 为静态源码 Registry；/themes/_ 为预生成主题。

自定义域名应使用 Cloudflare 项目的域名绑定流程配置，由平台管理 DNS 与 TLS。只操作 shadcn-uniapp.guygubaby.top，不修改已有其他站点或域名记录。

## 上线验收

1. 首页、/create、/creator、/blocks、/docs 可直接打开和刷新。
2. Creator 修改主题、浅深色和圆角后，真实 Wot 预览与 RootPortal 浮层跟随更新。
3. JSON 导入导出、SCSS 下载和主题链接回读正常。
4. Registry 文件返回 JSON 而不是 SPA HTML。
5. 域名 HTTPS 正常；GitHub 新提交能触发后续构建。

部署记录与实际验证结果由本次任务完成时补充；本文的目标配置本身不代表服务已上线。
