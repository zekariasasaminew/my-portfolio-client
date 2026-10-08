import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react-swc'

const SITE = 'https://www.zekariasasaminew.com'

interface RouteMeta {
  path: string
  title: string
  description: string
  image: string
}

const ROUTE_META: RouteMeta[] = [
  {
    path: '/blog/pact',
    title: 'The fastest isolation is the one you skip: building pact',
    description:
      "Twelve weeks building a Rust orchestrator for parallel AI coding agents. My first design was 3.4x slower than Copilot's own sub-agents; measured changes took it to 21% faster. Animated diagrams, every benchmark number, and what one good run does not prove.",
    image: '/images/pact/og.png',
  },
]

const escapeAttr = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

function withRouteMeta(html: string, meta: RouteMeta): string {
  const url = `${SITE}${meta.path}`
  const title = escapeAttr(meta.title)
  const description = escapeAttr(meta.description)
  const image = `${SITE}${meta.image}`
  const tags = [
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<link rel="canonical" href="${url}" />`,
  ].join('\n    ')
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${description}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${description}$2`)
    .replace(/(<meta property="og:type" content=")[^"]*(")/, `$1article$2`)
    .replace('</head>', `    ${tags}\n  </head>`)
}

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
    },
  }
}

export default defineConfig({
  plugins: [react(), routeMetaPages()],
})
