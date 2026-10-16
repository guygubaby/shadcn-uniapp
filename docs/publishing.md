# 手动发布 npm

`shadcn-uniapp@0.1.0` 已于 2026 年 10 月 16 日发布到 npm。以下流程用于后续版本；请先修改版本号，再进行检查、打包和发布。官网和 H5 预览是 private workspace，不发布；仓库不存储 npm token。

## 1. 安装并检查

使用 Node.js 22.18+（建议 24.x）。

```sh
pnpm install --frozen-lockfile
pnpm check
```

## 2. 检查发布包

```sh
pnpm pack:release
tar -tzf artifacts/shadcn-uniapp-0.1.0.tgz
```

应包含 package.json、README、许可证、dist 中的运行时 / CLI / Vite 插件及声明文件、registry 下的 20 个 Vue Block；不应包含网站源码、测试夹具、node_modules 或环境变量。下文的 0.1.0 为路径示例，请替换为待发布的新版本号。

## 3. 由你登录 npm

```sh
npm login --registry https://registry.npmjs.org
npm whoami --registry https://registry.npmjs.org
npm view shadcn-uniapp name version --registry https://registry.npmjs.org
```

确认登录账号具有 shadcn-uniapp 的发布权限。不要把登录凭证、OTP 或 token 发到聊天或提交到 Git。

## 4. 只发布这个包

```sh
cd packages/shadcn-uniapp
pnpm publish --access public --registry https://registry.npmjs.org
```

按 npm 提示完成浏览器登录或二次验证。不要在仓库根目录直接发布，也不要递归发布整个 workspace。prepack 会重新构建工具包；不会发布官网或替你推送 Git。

## 5. 验证与记录

```sh
npm view shadcn-uniapp@0.1.0 version bin exports --registry https://registry.npmjs.org
pnpm dlx shadcn-uniapp@0.1.0 --help
```

再用一个干净的 Wot UI 2.x 消费项目测试 init / generate / add。确认后可从仓库根目录记录发布：

```sh
git tag v0.1.0
git push origin v0.1.0
```

npm 相同版本不能重复发布。后续先修改 `packages/shadcn-uniapp/package.json` 的版本，同步 CLI 帮助和发布说明，提交后再重复上述步骤。
