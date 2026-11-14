import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { notes } from './src/data/notes'

const SITE = 'https://www.zekariasasaminew.com'

interface RouteMeta {
  path: string
  title: string
  description: string
  image: string
  type: 'website' | 'article'
}

const ROUTE_META: RouteMeta[] = [
  {
    path: '/blog/pact',
    title: 'The fastest isolation is the one you skip: building pact',
    description:
      "Twelve weeks building a Rust orchestrator for parallel AI coding agents. My first design was 3.4x slower than Copilot's own sub-agents; measured changes took it to 21% faster. Animated diagrams, every benchmark number, and what one good run does not prove.",
    image: '/images/pact/og.png',
    type: 'article',
  },
  {
    path: '/connect',
    title: "Zekarias Asaminew | Let's connect",
    description:
      'Software engineer at John Deere building AI agents and dev tools. Connect on LinkedIn or GitHub, or save my contact card.',
    image: '/images/og.png',
    type: 'website',
  },
]

const SITEMAP_PATHS = ['/', '/notes', ...notes.map((n) => `/notes/${n.id}`), '/blog/pact', '/ey-internship']

const escapeAttr = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

const setAttr = (html: string, selector: string, attr: string, value: string) =>
  html.replace(new RegExp(`(${selector} ${attr}=")[^"]*(")`), (_m, start: string, end: string) => start + value + end)

function withRouteMeta(html: string, meta: RouteMeta): string {
  const url = `${SITE}${meta.path}`
  const title = escapeAttr(meta.title)
  const description = escapeAttr(meta.description)
  const image = `${SITE}${meta.image}`
  let out = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
  out = setAttr(out, '<meta name="description"', 'content', description)
  out = setAttr(out, '<meta property="og:title"', 'content', title)
  out = setAttr(out, '<meta property="og:description"', 'content', description)
  out = setAttr(out, '<meta property="og:type"', 'content', meta.type)
  out = setAttr(out, '<meta property="og:url"', 'content', url)
  out = setAttr(out, '<meta property="og:image"', 'content', image)
  out = setAttr(out, '<meta name="twitter:title"', 'content', title)
  out = setAttr(out, '<meta name="twitter:description"', 'content', description)
  out = setAttr(out, '<meta name="twitter:image"', 'content', image)
  out = setAttr(out, '<link rel="canonical"', 'href', url)
  return stripPersonJsonLd(out)
}

const stripPersonJsonLd = (html: string) => html.replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/, '')

function notFoundPage(html: string): string {
  return stripPersonJsonLd(html)
    .replace(/\s*<link rel="canonical"[^>]*>/, '')
    .replace(/<title>[^<]*<\/title>/, '<title>Page not found | Zekarias Asaminew</title>')
    .replace('</head>', '  <meta name="robots" content="noindex" />\n  </head>')
}

function sitemap(): string {
  const urls = SITEMAP_PATHS.map((p) => `  <url><loc>${SITE}${p}</loc></url>`).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}

const ROBOTS = `User-agent: *
Disallow: /api/
Disallow: /r/

Sitemap: ${SITE}/sitemap.xml
`

function routeMetaPages(): Plugin {
  let outDir = 'dist'
  return {
    name: 'route-meta-pages',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      const index = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8')
      for (const meta of ROUTE_META) {
        const target = path.join(outDir, meta.path, 'index.html')
        fs.mkdirSync(path.dirname(target), { recursive: true })
        fs.writeFileSync(target, withRouteMeta(index, meta))
      }
      fs.writeFileSync(path.join(outDir, '404.html'), notFoundPage(index))
      fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap())
      fs.writeFileSync(path.join(outDir, 'robots.txt'), ROBOTS)
    },
  }
}

export default defineConfig({
  plugins: [react(), routeMetaPages()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'react', test: /node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/ },
            { name: 'mui', test: /node_modules[\\/](@mui|@emotion)[\\/]/ },
            { name: 'motion', test: /node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/ },
          ],
        },
      },
    },
  },
})
