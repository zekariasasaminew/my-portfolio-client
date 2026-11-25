import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { notes } from './src/data/notes'
import type { Note } from './src/types/note'
import { fetchGithubContributions } from './api/_lib/contributions'

const SITE = 'https://www.zekariasasaminew.com'

interface RouteMeta {
  path: string
  canonical?: string
  title: string
  description: string
  image: string
  type: 'website' | 'article'
  noindex?: boolean
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
  {
    path: '/notes',
    title: 'Notes | Zekarias Asaminew',
    description: 'Short write-ups on things I built, broke and fixed: AI agents, dev tooling, GitHub automation and side projects.',
    image: '/images/og.png',
    type: 'website',
  },
  {
    path: '/ey-internship',
    title: 'Eight Weeks at EY | Zekarias Asaminew',
    description: 'My summer as a Tax Technology & Transformation intern at EY in Chicago.',
    image: '/images/og.png',
    type: 'article',
  },
  {
    path: '/preview/contributions',
    title: 'GitHub Contributions Preview | Zekarias Asaminew',
    description: 'Preview of the GitHub contribution graph integrated into the portfolio.',
    image: '/images/og.png',
    type: 'website',
    noindex: true,
  },
  ...notes.map(noteMeta),
]

function noteMeta(note: Note): RouteMeta {
  const plain = note.content[0]
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#*_`>[\]]|\(https?:[^)]*\)/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  return {
    path: `/notes/${note.id}`,
    canonical: note.href,
    title: `${note.title} | Zekarias Asaminew`,
    description: plain.length > 160 ? `${plain.slice(0, 157).trimEnd()}...` : plain,
    image: '/images/og.png',
    type: 'article',
  }
}

const SITEMAP_PATHS = ['/', '/notes', ...notes.map((n) => `/notes/${n.id}`), '/blog/pact', '/ey-internship']

const escapeAttr = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

const setAttr = (html: string, selector: string, attr: string, value: string) =>
  html.replace(new RegExp(`(${selector} ${attr}=")[^"]*(")`), (_m, start: string, end: string) => start + value + end)

function withRouteMeta(html: string, meta: RouteMeta): string {
  const url = `${SITE}${meta.canonical ?? meta.path}`
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
  if (meta.noindex) {
    out = out.replace('</head>', '  <meta name="robots" content="noindex" />\n  </head>')
  }
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

function devContributionsApi(): Plugin {
  return {
    name: 'dev-github-contributions-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/github-contributions', async (req, res) => {
        try {
          const url = new URL(req.url ?? '/', 'http://localhost')
          const range = url.searchParams.get('range')
          const data = await fetchGithubContributions('zekariasasaminew', range)
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Cache-Control', 'no-cache')
          res.end(JSON.stringify(data))
        } catch {
          res.statusCode = 502
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Unable to load GitHub contributions' }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), devContributionsApi(), routeMetaPages()],
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
