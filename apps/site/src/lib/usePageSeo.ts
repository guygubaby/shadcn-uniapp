import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { getPageSeo, getStructuredData, siteUrl } from './seo'

export function usePageSeo() {
  const route = useRoute()
  useHead(
    computed(() => {
      const page = getPageSeo(route.path)
      const schema = getStructuredData(route.path)
      const image = `${siteUrl}/og-image.png`
      return {
        title: page.title,
        htmlAttrs: { lang: page.locale },
        meta: [
          { name: 'description', content: page.description },
          {
            name: 'robots',
            content: page.indexable ? 'index, follow, max-image-preview:large' : 'noindex, follow',
          },
          { property: 'og:type', content: 'website' },
          { property: 'og:site_name', content: 'shadcn-uniapp' },
          { property: 'og:title', content: page.title },
          { property: 'og:description', content: page.description },
          { property: 'og:url', content: page.canonical },
          { property: 'og:locale', content: page.locale === 'zh-CN' ? 'zh_CN' : 'en_US' },
          { property: 'og:locale:alternate', content: page.locale === 'zh-CN' ? 'en_US' : 'zh_CN' },
          { property: 'og:image', content: image },
          { property: 'og:image:width', content: '1200' },
          { property: 'og:image:height', content: '630' },
          { property: 'og:image:alt', content: 'shadcn-uniapp — Wot UI themes and uni-app blocks' },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: page.title },
          { name: 'twitter:description', content: page.description },
          { name: 'twitter:image', content: image },
          {
            name: 'twitter:image:alt',
            content: 'shadcn-uniapp — Wot UI themes and uni-app blocks',
          },
        ],
        link: [
          { rel: 'canonical', href: page.canonical },
          ...page.alternates.map((alternate) => ({ rel: 'alternate', ...alternate })),
        ],
        script: schema
          ? [
              {
                key: 'site-schema',
                type: 'application/ld+json',
                textContent: JSON.stringify(schema).replace(/</g, '\\u003c'),
              },
            ]
          : [],
      }
    }),
  )
}
