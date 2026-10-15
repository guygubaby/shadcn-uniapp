# 手动发布 npm

第一版 npm 包：`shadcn-uniapp@0.1.0`。官网和 H5 预览是 private workspace，不发布。维护者自行登录和发布；仓库不存储 npm token。本次实现不会代为执行 publish。

## 1. 安装并检查

使用 Node.js 22.18+（建议 24.x）。在本机可先选择已配置的 Node：

```sh
export PATH="/Users/bryceloskie/Library/Caches/fnm_multishells/41098_1779758644280/bin:$PATH"
pnpm install --frozen-lockfile
pnpm check
```

## 2. 检查发布包

```sh
pnpm pack:release
tar -tzf artifacts/shadcn-uniapp-0.1.0.tgz
```

应包含 package.json、README、LICENSE、dist 中的 JS/声明文件及 registry 下的三个 Vue Block；不应包含网站源码、测试夹具、node_modules 或环境变量。

## 3. 由你登录 npm

```sh
npm login --registry https://registry.npmjs.org
npm whoami --registry https://registry.npmjs.org
npm view shadcn-uniapp name version --registry https://registry.npmjs.org
```

首次发布前，最后一条若返回 E404，表示查询时尚无同名公开包，不代表名称已为你保留。若已有同名包且你无发布权限，应先改为你有权限的名称，再同步 CLI 安装文档。不要把登录凭证、OTP 或 token 发到聊天或提交到 Git。

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
