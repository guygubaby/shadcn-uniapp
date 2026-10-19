# Cloudflare GitHub 部署

目标仓库：https://github.com/guygubaby/shadcn-uniapp

目标域名：https://shadcn-uniapp.guygubaby.top

本项目使用 Vue + Vite SSG，构建时预渲染官网正文与 SEO 元信息。交互界面仍由 Vue 驱动；H5 预览和 Registry 在同一次构建中生成，无业务后端、数据库或认证服务。

## 构建配置

使用 Cloudflare Pages GitHub 集成，静态资源无需 Worker 或 Wrangler 配置。

- 生产分支：`main`
- 根目录：仓库根目录
- 安装：`pnpm install --frozen-lockfile`
- 构建命令：`pnpm build`
- 输出目录：`apps/site/dist`
- Node：`24.13.0` 或兼容的 Node 24.x
- pnpm：`10.32.1`（见 packageManager 字段）

仓库根目录的 `.node-version` 固定构建 Node 版本；Cloudflare Pages 支持读取此文件。Pages 环境变量建议另设 `PNPM_VERSION=10.32.1`，与锁文件及 CI 保持一致。

不要只构建 apps/site：它依赖先构建的 npm 工具包、Registry 和 uni-app H5 预览。Cloudflare 通过 GitHub 集成监听 main；不需要把 Cloudflare 或 npm 的凭证提交到仓库。

## 路由和缓存

网站默认英文：首页、/create、/blocks、/docs 与对应的 /zh 中文页面都输出独立 HTML，包含标题、描述、canonical、hreflang、Open Graph 与 JSON-LD。x-default 指向英文。语言切换保留查询参数和锚点；主题分享参数规范到无参数的 Creator URL。/creator 永久重定向到 /create；旧 /en 地址永久重定向到对应的无前缀英文地址。

Cloudflare Pages 的 HTML 扩展名解析支持直接刷新这些地址。根目录 404.html 让未知地址返回真正的 404；不要添加覆盖全站的 200 SPA fallback。sitemap.xml 从同一页面配置生成，不伪造 lastmod。

/preview/index.html 为真实的隔离 H5 应用；/r/_.json 为静态源码 Registry；/themes/_ 为预生成主题。它们不参与搜索索引。预览资源 URL 还包含 Tailwind 源码指纹，避免构建后处理生成的新 CSS 沿用旧文件名而命中浏览器旧缓存。

运行 pnpm build 会自动检查生成 HTML 中的正文、元信息、结构化数据、站点地图和分享图。发布后可将 https://shadcn-uniapp.guygubaby.top/sitemap.xml 提交到已验证的 Google Search Console / Bing Webmaster Tools；网站归属验证凭证不写入仓库。

自定义域名应使用 Cloudflare 项目的域名绑定流程配置，由平台管理 DNS 与 TLS。只操作 shadcn-uniapp.guygubaby.top，不修改已有其他站点或域名记录。

## 上线验收

1. 首页、/create、/creator、/blocks、/docs 可直接打开和刷新。
2. Creator 修改主题、浅深色和圆角后，真实 Wot 预览与 RootPortal 浮层跟随更新。
3. Creator 的安装命令直接使用 --preset，无需下载文件。短码与自定义颜色扩展在浏览器和 CLI 中还原相同主题；旧 ?theme= 分享链接仍可读取，新的分享链接使用 ?preset=。JSON 导入导出与 SCSS 下载保留。
4. Registry 文件返回 JSON 而不是 SPA HTML。
5. 域名 HTTPS 正常；GitHub 新提交能触发后续构建。

部署记录与实际验证结果由本次任务完成时补充；本文的目标配置本身不代表服务已上线。

预设码的解码逻辑包含在 npm 包内，不依赖服务端存储。上线新的预设码格式前，须先发布包含该解码器的 npm 版本，再部署生成相应命令的网站，避免 @latest 指向尚不支持的 CLI。
