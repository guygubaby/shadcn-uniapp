export const siteUrl = 'https://shadcn-uniapp.guygubaby.top'
export const seoPaths = ['/', '/create', '/blocks', '/docs'] as const
export type SiteLocale = 'zh-CN' | 'en-US'

const pages = {
  '/': {
    'zh-CN': {
      title: 'shadcn-uniapp — Wot UI 主题生成器与 uni-app 区块',
      description:
        '为 uni-app 与 Wot UI 2.x 创建 shadcn 风格主题。在线调整配色、字体、圆角与深浅模式，预览真实组件，导出 SCSS 和 JSON，添加可编辑的手机端与国际学校业务区块。',
    },
    'en-US': {
      title: 'shadcn-uniapp — Wot UI themes & uni-app blocks',
      description:
        'Create shadcn-inspired Wot UI themes for uni-app. Preview real components, export SCSS and JSON, and add editable mobile and international school blocks.',
    },
  },
  '/create': {
    'zh-CN': {
      title: 'Wot UI 在线主题生成器 — shadcn-uniapp',
      description:
        '在线定制 Wot UI 2.x 的配色、字体、圆角和密度，实时预览 uni-app 组件的深浅色效果。导出主题 SCSS、JSON 与安装命令，用于 H5 和微信小程序。',
    },
    'en-US': {
      title: 'Wot UI theme creator for uni-app — shadcn-uniapp',
      description:
        'Customize Wot UI colors, fonts, radii, and density. Preview light and dark themes on real uni-app components and export SCSS, JSON, and setup instructions.',
    },
  },
  '/blocks': {
    'zh-CN': {
      title: 'uni-app 手机端与国际学校区块 — shadcn-uniapp',
      description:
        '可复制源码的 Wot UI 手机端区块：微信登录、个人中心、地址选择、订单确认，以及校园参观、学生请假、学费账单和老师点名。支持主题切换与 CLI 按需添加。',
    },
    'en-US': {
      title: 'Mobile & school blocks for uni-app — shadcn-uniapp',
      description:
        'Editable Wot UI blocks for WeChat sign-in, accounts, addresses, checkout, campus visits, student absences, school fees, and teacher attendance. Own the Vue source.',
    },
  },
  '/docs': {
    'zh-CN': {
      title: 'shadcn-uniapp 安装文档 — Wot UI、Lucide 与主题配置',
      description:
        '了解 shadcn-uniapp 的安装、初始化、主题生成与区块添加。配置 Vite 5 Lucide 图标适配、Wot UI 运行时主题和弹层，兼容 UnoCSS 与 Tailwind CSS v4。',
    },
    'en-US': {
      title: 'Install & configure shadcn-uniapp — documentation',
      description:
        'Install shadcn-uniapp, initialize Wot UI themes, and add Vue blocks. Set up Lucide with Vite 5, runtime themes and overlays, UnoCSS, or Tailwind CSS v4.',
    },
  },
} as const

export function routeLocale(path: string): SiteLocale {
  return path === '/en' || path.startsWith('/en/') ? 'en-US' : 'zh-CN'
}

export function basePath(path: string): string {
  return (routeLocale(path) === 'en-US' ? path.slice(3) : path).replace(/\/$/, '') || '/'
}

export function localizedPath(path: string, locale: SiteLocale): string {
  const base = basePath(path)
  return locale === 'en-US' ? `/en${base === '/' ? '' : base}` : base
}

export function getPageSeo(path: string) {
  const locale = routeLocale(path)
  const base = basePath(path)
  const route = base === '/creator' ? '/create' : base
  const page = pages[route as keyof typeof pages]?.[locale]
  const canonical = `${siteUrl}${localizedPath(page ? route : '/404', locale)}`
  const title =
    page?.title ??
    (locale === 'zh-CN' ? '页面不存在 — shadcn-uniapp' : 'Page not found — shadcn-uniapp')
  const description =
    page?.description ??
    (locale === 'zh-CN'
      ? '这个页面不存在，请返回首页或查看安装文档。'
      : 'This page does not exist. Return home or read the documentation.')
  return {
    locale,
    title,
    description,
    canonical,
    indexable: Boolean(page),
    alternates: page
      ? [
          { hreflang: 'zh-CN', href: `${siteUrl}${localizedPath(route, 'zh-CN')}` },
          { hreflang: 'en', href: `${siteUrl}${localizedPath(route, 'en-US')}` },
          { hreflang: 'x-default', href: `${siteUrl}${localizedPath(route, 'zh-CN')}` },
        ]
      : [],
  }
}

export function getStructuredData(path: string) {
  const page = getPageSeo(path)
  if (!page.indexable) return undefined
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        name: 'shadcn-uniapp',
        url: `${siteUrl}/`,
        inLanguage: ['zh-CN', 'en'],
      },
      {
        '@type': 'SoftwareSourceCode',
        '@id': `${siteUrl}/#software`,
        name: 'shadcn-uniapp',
        url: `${siteUrl}/`,
        description: getPageSeo(localizedPath('/', page.locale)).description,
        codeRepository: 'https://github.com/guygubaby/shadcn-uniapp',
        license: 'https://github.com/guygubaby/shadcn-uniapp/blob/main/LICENSE',
        programmingLanguage: ['TypeScript', 'Vue'],
        runtimePlatform: 'uni-app',
        downloadUrl: 'https://www.npmjs.com/package/shadcn-uniapp',
      },
      {
        '@type': 'WebPage',
        '@id': `${page.canonical}#webpage`,
        url: page.canonical,
        name: page.title,
        description: page.description,
        inLanguage: page.locale,
        isPartOf: { '@id': `${siteUrl}/#website` },
        about: { '@id': `${siteUrl}/#software` },
      },
    ],
  }
}

export function createSitemap(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${seoPaths
    .flatMap((path) =>
      (['zh-CN', 'en-US'] as const).map((locale) => {
        const page = getPageSeo(localizedPath(path, locale))
        return `  <url><loc>${page.canonical}</loc>${page.alternates.map((alternate) => `<xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${alternate.href}" />`).join('')}</url>`
      }),
    )
    .join('\n')}\n</urlset>\n`
}
