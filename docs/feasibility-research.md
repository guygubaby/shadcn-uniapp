# shadcn 风格 uni-app 组件库可行性研究

调研日期：2026-10-15。范围：Vue 3 + uni-app，H5 与小程序；建议首批明确为 H5 + 微信小程序，不包含原生 App。本文区分已核实事实、建议与未验证事项；未安装依赖、未创建应用、未运行浏览器或小程序。

## 结论

**可以实现 shadcn 的设计语言、源码交付和 CLI 安装体验，但不是把 shadcn-vue / Reka UI 原样编译成小程序。** 最小可行路线是：复用 Wot UI V2 的 uni-app 运行时，增加自有主题、可编辑的业务组件源码和 Registry；只有 Wot 无法满足的结构/交互才自研。若要求每个内部节点和行为也由使用方源码掌控，则要复制并维护相应源码，成本与仅封装 npm 组件不同。

## 最新目标：快速换肤 + Theme Creator + Blocks

后续讨论进一步明确：优先让现有 Wot 项目快速迁移视觉，而非取得所有基础组件的源码拥有权。针对这一目标，推荐将 `shadcn-uniapp` 定位为 **Wot 生态的主题系统、可视化主题工具和源码 Blocks**；保留原有 `wd-*`、props、事件和模型契约，不强制通过新组件名称包装 Wot。以下是方案建议，不代表已经初始化或实现。

```text
Theme Creator / 手写 ThemeConfig
          -> 同一个主题生成模块
             -> Wot 变量：驱动现有 wd-* 组件
             -> 自有语义变量：驱动页面和 Blocks
             -> 可导出的 CSS/SCSS、JSON、必要的 Provider 变量

Blocks = Wot 组件 + 选定的原子样式体系 + 语义变量 + 业务组合源码
Vite Plugin = 可选的配置集成与开发体验，不是换肤的前提
```

**主题配置只维护一份。** Creator、预览和导出必须使用同一生成逻辑；不要让界面实时展示一套颜色、生成到消费项目的 CSS 又是另一套。配置需要版本和导入校验；背景/前景、主色/主色文字、状态色和边框应成对检查。给 Wot 的输出需覆盖相应色阶与组件状态，不只是替换一个 primary。主题文件尽量与 Tailwind/UnoCSS 解耦；Blocks 使用消费项目已选定的原子体系，不为换主题强迫旧项目切换样式系统。

**Theme Creator 首版**只需要品牌与语义色、圆角/密度等已有 Token 范围内的设置、浅深色、真实 Wot H5 与 Blocks 预览、对比度提示、JSON 导入导出和主题文件导出。不先加入账号、云端保存或拖拽页面搭建；小程序仍通过导出的同一配置进行真机验收，H5 预览不是微信兼容性证据。

**Blocks 首版**可以是登录表单、设置页、筛选列表等三类源码组合，内部直接使用目标 Wot 版本的组件，而不是重建 Button/Input/Picker。Registry 分发这些组合及必要工具，声明所需 Wot 版本、主题版本和样式前置条件；不暗中替换使用方页面或覆盖业务逻辑。

**Patch 的优先级：**官方主题变量和组件变量 -> 公开 props/slots 与局部样式 -> 确有缺口的固定版本最小补丁。npm 依赖的源码修复优先考虑可审查的 `pnpm patch`，并向上游反馈。只有编译期确有必要时才让 Vite 插件转换源码；转换应限制目标包、版本、文件和平台，匹配失败明确报错，不能全局正则改写依赖或掩盖不兼容。主题生成、配置监视与热更新也只有在手动导入/导出流程显得重复时才加入插件。

**迁移版本是当前未决信息。** [官方 v1 -> v2 迁移指南](https://github.com/wot-ui/wot-ui/blob/v2.3.2/docs/guide/migration-v2.md) 明确说明，这不只是包名升级，还涉及 Form 校验、Dialog、组件名称、按钮变体和主题变量。如果现有项目是 `wot-design-uni` 1.x，优先为其当前版本制作主题适配，不把快速换肤与升级到 `@wot-ui/ui` 2.x 捆绑。首版只实现实际需要的主版本；不要为了假设的兼容性同时开发两套适配。业务硬编码颜色、显式 color 属性、custom-style 和既有深度覆盖仍需审计，不能保证一个主题入口自动改变整页所有颜色。

建议的新验收顺序：现有代表页面接入主题且交互不变 -> 同一配置驱动 Creator 预览与导出 -> 三个 Blocks 可安装并消费主题 -> 有已证实缺口再加 Patch/Plugin。浮层、插槽、全局背景和局部主题仍是最早的微信 + H5 回归重点。

## 已核实：Wot 已经提供的基础

1. **无需从零实现跨端运行时。** 当前 npm `@wot-ui/ui` 的 `latest` 是 `2.3.2`，GitHub 对应正式发布为 `v2.3.2`；旧包 `wot-design-uni` 的 latest 是 `1.14.0`。新包的发布配置声明 Vue 3、H5 和微信小程序支持。来源：[npm 元数据](https://registry.npmjs.org/@wot-ui%2fui)、[正式 release](https://github.com/wot-ui/wot-ui/releases/tag/v2.3.2)、[包配置](https://github.com/wot-ui/wot-ui/blob/v2.3.2/src/uni_modules/wot-ui/package.json)。

2. **官方已经有 shadcn 风格主题示例，但不是 npm 包内置可导入的独立 preset。** `v2.3.2` 的 `src/theme/presets.scss` 包含 `shadcn-theme-vars` 与 `.wot-theme-shadcn`，主要覆盖浅色语义颜色；不能等同于全部 shadcn 组件结构、尺寸、交互和深色主题。核对 npm 实际发布 tarball 的 395 个文件，没有 `preset` / `shadcn` 文件，主题入口只导入基础、light、dark。应从固定版本示例提取所需内容到自己的主题文件，不要假设存在 `@wot-ui/ui/.../shadcn` 导出。来源：[主题文档](https://github.com/wot-ui/wot-ui/blob/v2.3.2/docs/guide/custom-theme.md)、[主题示例源码](https://github.com/wot-ui/wot-ui/blob/v2.3.2/src/theme/presets.scss)、[npm 发布包](https://registry.npmjs.org/@wot-ui/ui/-/ui-2.3.2.tgz)、[主题入口](https://github.com/wot-ui/wot-ui/blob/v2.3.2/src/uni_modules/wot-ui/styles/theme/index.scss)。

3. **灵活主题不需要另造底层机制。** Wot V2 已采用基础变量 → 语义变量 → 组件变量三级 Token；支持全局 CSS 变量、局部 `ConfigProvider`、组件级覆盖、浅深色和运行时主题变量。`ConfigProvider` 不会自动改变页面背景/正文颜色，这部分仍由项目主题负责。来源：[定制主题](https://github.com/wot-ui/wot-ui/blob/v2.3.2/docs/guide/custom-theme.md)、[ConfigProvider](https://github.com/wot-ui/wot-ui/blob/v2.3.2/docs/component/config-provider.md)。

建议的使用形态（示意，尚未编译验证）：

```vue
<!-- App.vue 的全局 style：本地文件只保留所需 shadcn mixin 与选择器 -->
<style lang="scss">
@use '@wot-ui/ui/styles/theme/index.scss' as *;
@use './theme/shadcn.scss' as *;
</style>
```

```vue
<!-- 页面或页面级公共壳；不是在普通 App.vue 中直接放页面模板 -->
<wd-config-provider theme="shadcn">
  <wd-button>提交</wd-button>
</wd-config-provider>
```

## 已核实：不能直接复用 shadcn-vue 运行时的原因

| 边界 | 一手证据 | 对实现的影响 |
| --- | --- | --- |
| 动态渲染与 `asChild` | Reka 的 [Primitive](https://github.com/unovue/reka-ui/blob/v2/packages/core/src/Primitive/Primitive.ts) 用 `h()`，其 [Slot](https://github.com/unovue/reka-ui/blob/v2/packages/core/src/Primitive/Slot.ts) 用 `cloneVNode()` 合并属性；uni-app [Vue 3 API 表](https://github.com/dcloudio/unidocs-zh/blob/master/docs/tutorial/vue3-api.md) 将微信小程序的 `h`、`render`、动态 `component` 标记为不支持。 | 不能承诺 Reka 的 `asChild` / 任意标签替换原样可用；采用显式 SFC 模板、props、slots、事件组合。 |
| DOM、焦点与浮层 | Reka [FocusScope](https://github.com/unovue/reka-ui/blob/v2/packages/core/src/FocusScope/FocusScope.vue) 直接使用 Document、焦点事件、MutationObserver；[PopperContent](https://github.com/unovue/reka-ui/blob/v2/packages/core/src/Popper/PopperContent.vue) 使用 Floating UI。uni-app [节点查询](https://github.com/dcloudio/unidocs-zh/blob/master/docs/api/ui/nodes-info.md) 是有作用域的查询/回调机制，不是任意 DOM API。 | H5 键盘/焦点、微信触摸/滚动/定位分别适配；不能靠替换 `div` 为 `view` 解决。 |
| Portal / Teleport | uni-app 当前 [API 表](https://github.com/dcloudio/unidocs-zh/blob/master/docs/tutorial/vue3-api.md) 已将微信 Teleport 标注为 `5.14`，并注明仅微信、支付宝、京东小程序支持；但 [basics 文档](https://github.com/dcloudio/unidocs-zh/blob/master/docs/tutorial/vue3-basics.md) 仍有旧的“不支持”表述。Wot [RootPortal](https://github.com/wot-ui/wot-ui/blob/v2.3.2/src/uni_modules/wot-ui/components/wd-root-portal/wd-root-portal.vue) 实际分支为 H5 Teleport、微信原生 root-portal。 | 不应绝对声称“小程序没有 Teleport”；应固定编译器/基础库版本，优先复用已做平台分支的 RootPortal。 |
| 样式与图标 | uni-app [CSS 文档](https://github.com/dcloudio/unidocs-zh/blob/master/docs/tutorial/syntax-css.md) 区分 `page` 和 Web `:root`，并提示自定义组件选择器限制；[image 文档](https://github.com/dcloudio/unidocs-zh/blob/master/docs/component/image.md) 对小程序 SVG 资源有限制。 | 不能照搬 Web reset、复杂选择器、inline SVG 组件并宣称通用；原子 CSS 编译、图标方案需要微信真机验证。 |

## 已核实：Wot 复用的边界

- **样式隔离必须成为组件契约。** Wot 的 [Button](https://github.com/wot-ui/wot-ui/blob/v2.3.2/src/uni_modules/wot-ui/components/wd-button/wd-button.vue) 和 ConfigProvider 显式设置 `styleIsolation: 'shared'`、`virtualHost`；[样式文档](https://github.com/wot-ui/wot-ui/blob/v2.3.2/docs/guide/custom-style.md) 明确：使用方自己的小程序封装组件也可能需要设置 shared。建议定义清晰的 `class` / `customClass` / `style` 映射，而非假设 Web 属性透传完全一致；shared 同时需要命名空间避免全局污染。
- **局部主题不能只依赖 CSS 继承和 Vue inject。** Wot [ConfigProvider 文档](https://github.com/wot-ui/wot-ui/blob/v2.3.2/docs/component/config-provider.md) 明确说明，小程序 slot、RootPortal 场景可能丢失 provider 上下文，提供 `useConfigProvider` 兜底。建议首先验证“嵌套主题 + 插槽 + 弹出层”组合，而非仅展示一个能变色的按钮。
- **复用高成本行为，不把 Wot 当成完整 headless primitives。** [Popup 源码](https://github.com/wot-ui/wot-ui/blob/v2.3.2/src/uni_modules/wot-ui/components/wd-popup/wd-popup.vue) 已包含遮罩、过渡、安全区、关闭事件；[Picker](https://github.com/wot-ui/wot-ui/blob/v2.3.2/src/uni_modules/wot-ui/components/wd-picker/wd-picker.vue) 已组合 Popup、滚轮、确认/取消和选中状态。但它们也有既定模板、节点和状态机，主题变量不会把移动端滚轮 Picker 变成 PC Combobox。建议直接复用匹配的复杂组件；结构不匹配时用更底层组件重组，确有必要才复制/重写。
- **跨页面 Provider 是另一问题，不是 shadcn 本身能力。** Wot 文档提供 [uni-ku/root](https://github.com/uni-ku/root) 的应用壳方案；该项目通过构建期虚拟根 SFC 包裹页面，并明确不完全等价于 Vue Router 的 RouterView。可以按需采用，但不必为最小 PoC 增加依赖，也不能假设普通 App.vue 有可跨端通用的页面模板插槽。

## 已核实：可以复用 shadcn 的源码分发机制

shadcn-vue 的 [Registry 规范](https://github.com/unovue/shadcn-vue/blob/dev/apps/v4/content/docs/registry/registry-item-json.md) 可以描述 Vue SFC、工具函数、npm 依赖和其他 Registry 依赖；[安装文档](https://github.com/unovue/shadcn-vue/blob/dev/apps/v4/content/docs/registry/getting-started.md) 支持通过 URL 或配置好的命名空间安装。这正好能实现“按需添加源码到项目”，不必为了这个体验重写整个 CLI。

但 **Registry 格式兼容不代表 uni-app 安装已验证**：[CLI 初始化文档](https://github.com/unovue/shadcn-vue/blob/dev/apps/v4/content/docs/06.cli.md) 的模板、Reka 基座与默认依赖面向 Web；[项目检测源码](https://github.com/unovue/shadcn-vue/blob/dev/packages/cli/src/utils/get-project-info.ts) 没有专门的 uni-app 分支。应先验证“正确配置的 uni-app 消费项目 + 自有 Registry + upstream add”；只有初始化、路径重写或 CSS 注入确实不满足时，才补一个薄的 uni-app CLI，而非直接 fork 全部上游工具。调研时 npm shadcn-vue latest 为 2.8.2；上述 dev 分支内容后续可能变化，实施应固定版本。

重要边界：自有 Registry 的组件依赖必须指向自己的命名空间或完整 URL。上游文档明确，裸名 `button` 默认解析到 shadcn-vue 的 Web Registry，可能意外拉入 Reka 和 Web 组件；不能只把最外层组件换成跨端实现。

Registry 产物可以是静态 JSON 文件，MVP 不需要 Node.js API、数据库、登录或动态组件服务。组件进入使用方项目后，应以明确版本和 diff 处理升级，不覆盖业务修改。复制上游源码或主题示例应保留 MIT 版权和许可声明：[Wot LICENSE](https://github.com/wot-ui/wot-ui/blob/v2.3.2/LICENSE)、[shadcn-vue LICENSE](https://github.com/unovue/shadcn-vue/blob/dev/LICENSE)。

## 推荐的最小架构

```text
业务项目
  -> Registry / CLI 添加本地 Vue SFC、主题和必要工具
  -> 自有组件契约：variant、size、v-model、slots、事件、class
  -> 自有语义 Tokens -> Wot Tokens 的适配
  -> uni-app 基础组件 + 按需复用 Wot 组件
  -> H5 / 微信小程序
```

组件分两类即可：

- 结构简单、需要高度自由的 Button / Card / Badge 等，可以直接交付自己的 uni-app 模板源码；也可先封装 Wot，实际遇到结构限制再替换，不为完整度而重写。
- Popup / Picker 等高成本交互，在交互契约匹配时复用 Wot，通过源码包装层适配 API 和主题。若要求使用方改动这些组件的内部结构，再单独源码化，并承担依赖闭包、许可和升级维护。

源码拥有权不等于零依赖：shadcn-vue 也依赖 Reka。关键差别是 Wot 不属于纯无样式基元，包装层不能保证其内部任意节点都能通过一个 class 改写。不承诺完整 shadcn-vue API / asChild 兼容；基础语义尽量一致，跨端差异写进契约。若继续保留现有 PC shadcn-vue，优先共享设计 Tokens，不必强行统一其底层实现。

起步目录只需 Registry 源码、主题、一个 uni-app playground、发布脚本；通过兼容性 PoC 后再决定是否增加独立 CLI 包。H5 与小程序共用组件，只有真实出现的平台差异才使用条件编译或小型适配组件，不先维护两套完整 UI。

## 原子样式与主题路线

以下为建议，不代表已经选择或配置了样式系统。真正开始新 uni-app 项目前，仍按项目规则在 UnoCSS 与 Tailwind CSS v4 + weapp-tailwindcss 中选择一个，不能混装。

若优先贴近 shadcn 的工具链，建议评估 Tailwind CSS v4 + weapp-tailwindcss。[当前 uni-app Vite 官方集成指南源码](https://github.com/sonofmagic/weapp-tailwindcss/blob/main/website/docs/quick-start/frameworks/uni-app-vite.md) 已提供完整路径：纯 CSS 入口、实际全局导入、`uni()` 后注册 `WeappTailwindcss`、绝对 `cssEntries`；不要再注册另一套 Tailwind Vite/PostCSS 生成插件。[多端说明](https://github.com/sonofmagic/weapp-tailwindcss/blob/main/website/docs/tailwindcss/v4-reference.md) 指出同一多端工程的 H5 和小程序应保留此插件，由目标环境切换输出。若选择 UnoCSS，则使用该体系的原子类与图标规则，不再配置 Tailwind 生成链路。

建议的主题契约：

1. 组件只使用语义角色，如 background / foreground、primary / primary-foreground、muted、border、input、ring；参照 [shadcn-vue 主题规范](https://github.com/unovue/shadcn-vue/blob/dev/apps/v4/content/docs/04.theming.md)，不要把品牌色写死在模板里。
2. 以 Wot 的三级 Token 和 ConfigProvider 为底层；补齐 shadcn 语义映射、颜色色阶、圆角、间距和字体。主题自由度还受组件开放的 Token 和结构限制，不把“换主色”宣称为“任意改设计”。
3. 支持全局、页面/局部、组件覆盖与浅深色；根页面和 Portal 都应得到同一主题。运行时主题使用变量，不拼接动态 `bg-${color}` 一类无法稳定静态提取的类名。
4. 先约定支持的 CSS 子集。Web 版复杂选择器、现代颜色、属性状态、SVG 和动画不能因经过原子 CSS 编译就视作自动兼容；用目标产物和真机结果决定降级。H5 的 focus/keyboard 与小程序触摸、原生按钮能力分别验收。

实现时应遵守项目约定的 uni-app / Vite 5 及其他固定依赖。Wot V2、样式工具和这些版本之间的兼容性属于 PoC 验收项；没有必要时不因上游 Web 示例升级到 Vite 8，也不为组件库强制引入路由、后端或全局状态系统。

## 实施顺序与验收门槛

| 阶段 | 产物 | 完成门槛 |
| --- | --- | --- |
| 1. 兼容性 PoC | 一个 uni-app playground；Button、Input、Dialog/Sheet、Picker；必要时 Tabs | H5 与微信目标构建成功；微信真机检查主题、class 覆盖、浮层、键盘和滚动；明确最低支持版本。先过高风险交互，不只做静态 Card。 |
| 2. 最小设计契约 | 语义 Tokens、主题映射、variant/size/v-model/事件规范 | 同一组件能切换至少两套品牌与浅深色；局部主题、嵌套插槽、Portal 不丢失主题；兼顾可访问性。 |
| 3. 源码安装闭环 | 自有 Registry、依赖清单；必要时薄 CLI/init | 在第二个干净消费项目完成配置与 add；源码、导出、工具、CSS、别名和依赖齐全；重复添加不静默覆盖修改。 |
| 4. 第一批可用组件 | 按业务需要扩充基础、表单与反馈组件 | 每个组件有两端示例、交互测试与明确支持矩阵；重点覆盖 disabled、loading、error、空值和受控更新，不为凑数移植全部 PC 组件。 |
| 5. 发布与维护 | 文档、H5 示例、微信示例、版本化 Registry、更新说明 | 发布前从空项目重跑安装闭环；控制小程序包体；明确支持平台、版本和更新策略；保留上游许可。 |

第一阶段失败时先修运行时或缩小组件 API，不提前扩大 Registry。第一版不做与目标无关的桌面交互大全、主题可视化编辑器、复杂 CLI 插件系统、其他原生端适配。

## 待验证与范围说明

推荐先做一个真实的 H5 + 微信 PoC：本地主题 / Button / Input / Tabs / Dialog 或 Sheet / Picker，加上嵌套主题与弹层场景。通用状态逻辑尽量共享，平台差异封装到少量运行时组件，而不是每个业务组件各写一套 H5 和微信版本。

最早验收的风险是小程序样式隔离、Portal 主题传播、软键盘遮挡、滚动锁定、安全区和组件源码复制后的依赖完整性；H5 另验收焦点、键盘和响应式。通过后再扩大组件数量和 Registry。未执行这些运行验证，因此本文证明的是架构可行与已有复用基础，不是已证明所有组件跨端兼容。

本文按用户随后明确的 H5 + 小程序范围理解“uni-app”，不包含原生工业设备 App。首版建议先定为微信；支付宝、抖音等应单列支持矩阵，不从“uni-app”推导出已经全面支持。最低微信基础库、uni-app 编译器版本和现有 PC 端需要多大程度的 API 兼容，仍须在实施前确定。

Context7 当次配额耗尽、未发现可用 uni-helper 官方文档工具，因此使用上述官方 HTTP 文档与仓库源码交叉核对。已检索 Modern Web Guidance 的设计系统与可访问性主题，但本次没有实现 UI，未将浏览器专属指南当成小程序兼容性的证据。
