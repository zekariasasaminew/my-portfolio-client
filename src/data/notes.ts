import type { Note } from "../types/note";

export const notes: Note[] = [
  {
    id: 8,
    title: "The fastest isolation is the one you skip: building pact",
    hook: "My first design was 3.4x slower than Copilot's own sub-agents. Twelve weeks of measuring got it to 21% faster.",
    content: [
      "Twelve weeks building a Rust CLI that runs multiple coding agents in parallel on one repo. My first design was 3.4x slower than Copilot's own sub-agents; measured changes took it to 21% faster. Animated diagrams, every benchmark number, and what one good run does not prove.",
    ],
    createdAt: "2026-10-04",
    tags: ["#rust", "#ai-agents", "#benchmarks", "#pact"],
    href: "/blog/pact",
    readMinutes: 15,
  },
  {
    id: 7,
    title: "Auto merge Dependabot patch PRs with GitHub Actions",
    hook: "Dependabot kept asking me to merge green patch PRs, so I taught GitHub to do it for me.",
    content: [
    "## **Dependabot patch PRs** were constantly interrupting my development workflow with manual merge tasks. As a student developer, I want to focus on learning and shipping solutions, not managing dependency updates. I created a GitHub Actions automation that handles patch-level merges automatically once checks pass.",
    "## The Real Problem\n\nDependabot was creating PRs daily for patch updates (like `1.2.3` → `1.2.4`), and even when all checks passed and the PRs were green, I had to manually review and merge them. This was:\n\n- **Distracting**: Constant interruptions from actual development work\n- **Time-consuming**: Administrative tasks that don't teach you anything\n- **Annoying**: Having to context-switch for already-validated updates\n- **Unproductive**: As a student, I want to learn by building, not by clicking merge buttons",
    "## Why This Matters for Student Developers\n\nDevelopers should focus on developing and shipping solutions, not sitting down and merging already green PRs. These interruptions pull you away from the creative problem-solving that actually helps you grow as an engineer.",
    "## The Broken Workflow\n\nThis was my first attempt (didn't work):\n\n```yaml\nname: dependabot auto merge\non:\n  pull_request_target:\n    types: [opened, reopened, synchronize, ready_for_review]\n  workflow_dispatch:\njobs:\n  automerge:\n    runs-on: ubuntu-latest\n    steps:\n      - name: Enable auto merge\n        run: gh pr merge ${{ github.event.pull_request.number }}\n```\n\n**Problems:**\n- Wrong directory\n- No checkout\n- Wrong event actor",
    "## The Fix\n\n**Moved the workflow to `.github/workflows/` and committed to both `main` and `dev`.**\n**Switched to check the PR author:**\n\n```yaml\njobs:\n  automerge:\n    if: ${{ github.event.pull_request.user.login == 'dependabot[bot]' }}\n    runs-on: ubuntu-latest\n    steps:\n      - name: Dependabot metadata\n        id: meta\n        uses: dependabot/fetch-metadata@v2\n        with:\n          github-token: ${{ secrets.GITHUB_TOKEN }}\n\n      - name: Enable auto merge for patch updates\n        if: steps.meta.outputs.update-type == 'version-update:semver-patch'\n        uses: peter-evans/enable-pull-request-automerge@v3\n        with:\n          token: ${{ secrets.GITHUB_TOKEN }}\n          pull-request-number: ${{ github.event.pull_request.number }}\n          merge-method: merge\n```",
    "## How it Works Now\n\nOn a Dependabot PR, the workflow checks the update type. If it's a patch, it enables auto merge. **GitHub waits for branch protection checks to pass, then merges the PR automatically.**",
    "## Key Takeaways\n\n- ✅ **Check the PR author, not the event actor**\n- ✅ **Use actions that accept the PR number, not local git context**\n- ✅ **Let branch protection decide when the merge happens**",
    ],
    createdAt: "2025-09-02",
    tags: ["#github", "#dependabot", "#actions", "#automation"],
  },
  {
    id: 11,
    title: "CampusEx: I got tired of watching furniture go in the dumpster",
    hook: "Every move-out, perfectly good couches end up in the trash. So I built a marketplace only my campus can use. 1,000+ users later, here's what that took.",
    content: [
      "Every spring at move-out, the dumpsters behind the dorms fill up with mini fridges, desks, lamps, and couches that are completely fine. Meanwhile the people moving in next fall are buying the same stuff new. The only thing missing was a way for those two groups to find each other.\n\nFacebook Marketplace is full of strangers and scams. GroupMe chats scroll away in an hour. So I built [CampusEx](https://www.campus-ex.com): a marketplace where only students at my school can sign in.",
      "## Keeping it campus-only\n\nThe whole trust model is one rule: you need an `@augustana.edu` email to get in. Sign-in is a magic link (no passwords to leak), and the check runs in two places: the sign-in page refuses other domains, and the middleware double-checks every request after that.\n\nLater I added an admin allow list in the database, so I could let in specific people (like staff) without changing code, and removing someone revokes their session right away.\n\nUnder that, PostgreSQL row-level security does the heavy lifting. The database itself decides who can see or edit a row, so even a bug in my frontend can't show you someone else's hidden listing.",
      "## The moderation gate\n\nA campus marketplace with no moderation is one bad listing away from being shut down. But I'm one person, and I wasn't going to manually approve every lamp.\n\nSo every new listing starts **hidden**. A Supabase Edge Function grabs the photo and text and sends them to GPT-4o with vision, which scores the listing from 0 to 100 across 9 safety categories: weapons, drugs, violence, harassment, dangerous goods, and so on. Each category has its own threshold, and the strict ones (weapons, drugs, harassment) are very strict on purpose.\n\nA few rules I'm glad I set early:\n\n- **Fail safe.** If the model times out or errors, the listing stays hidden. Never fail open.\n- **Don't block the user.** Moderation runs in the background, so posting feels instant. The owner sees a \"Review in progress\" badge for a few seconds.\n- **Rate limits before the AI call.** 15 listings per 10 minutes per person, plus a global cap, so nobody can run up my OpenAI bill.\n- **Users can't touch moderation fields.** Row-level security blocks anyone but the server from changing `visibility` or `moderation_status`.",
      "## Did people use it?\n\nYes, and more than I expected. It hit **200+ listings in its first 3 weeks** and has grown to **1,000+ users**, all from word of mouth. No ads. The infra costs stay **under $20 a month**.\n\nAfter launch I added the stuff people asked for: in-app messaging between buyer and seller, saved listings, profiles, notifications, and a \"requests\" board for when you're looking for something nobody has posted yet.",
      "## The scariest moment\n\nIt wasn't a bug in my code. It was almost a bug in production.\n\nEarly on, I had applied some database migrations by hand in the Supabase dashboard instead of through the CLI. They worked, but the CLI never recorded them. Months later an AI agent ran `supabase migration list`, saw 14+ migrations that looked missing in prod, and suggested `supabase db push`. That would have re-run SQL that wasn't safe to run twice, on the live database.\n\nI pushed back, we checked the actual tables and policies directly, and everything was already there. Now my rule is: never trust one tool's view of production. Look at the real thing before you change it.",
      "## What I'd tell you if you want to build one\n\n- Start with the trust rule. For me that was the school email. Everything else got easier once strangers were out.\n- Put security in the database, not just the UI. Row-level security caught mistakes I didn't know I'd made.\n- Default to hidden. Showing something late is a small annoyance. Showing something bad is the end of the project.\n- Launch before it's done. The features people asked for were not the ones I would have guessed.",
    ],
    createdAt: "2026-11-14",
    tags: ["#nextjs", "#supabase", "#postgresql", "#ai-moderation", "#studentlife"],
  },
  {
    id: 6,
    title: "Lazy init to fix a Next.js build error with Supabase env vars",
    hook: "My Next.js build died because Supabase checked env vars too early. Lazy init fixed it.",
    content: [
      "## TL;DR\n\n**Next.js** tried to pre-render the 404 page during build, which imported my Supabase client. The client validated `NEXT_PUBLIC_SUPABASE_URL` at import time, before envs existed in the build context. That threw an error and broke CI. I switched to **lazy initialization** so validation happens only on first use at runtime. Builds now pass locally and in GitHub Actions.",
      '## Context\n\nI finalized a **GitHub Action** for my site and the build failed on the 404 route. The log showed:\n\n```\nError occurred prerendering page "/_not-found"\nError: Missing NEXT_PUBLIC_SUPABASE_URL environment variable\n```',
      "## What really happened\n\nDuring `next build`, static generation imports modules for routes, including `/_not-found`. That import pulled in:\n\n1. `authContext.tsx` → `supabaseClient.ts`\n2. `supabaseClient.ts` immediately read envs and threw if missing\n3. At build time, repo secrets and local `.env` values are **not wired** into that import step\n\nSo the check failed.",
      '## The problematic code\n\nThis ran at **import time**:\n\n```typescript\nconst supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;\nif (!supabaseUrl) {\n  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");\n}\n```',
      "## The fix\n\n**Defer creation and validation** until the client is actually used. I used a tiny proxy that constructs the client on first access and then caches it:\n\n```typescript\nlet _supabase: ReturnType<typeof createClient> | null = null;\n\nexport const supabase = new Proxy({}, {\n  get(_target, prop) {\n    if (!_supabase) {\n      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;\n      // validation happens here, at runtime\n      _supabase = createClient(url, anon, options);\n    }\n    return _supabase[prop];\n  },\n});\n```\n\nThis way, build time only imports the proxy with **no validation**, but at runtime when a page first calls `supabase.auth.getUser()`, the proxy builds the real client.",
      "## Key Takeaways\n\n- ❌ **Avoid side effects** at module import time in Next.js apps\n- ✅ **Validate envs** on first use or inside functions that only run at runtime\n- ✅ For libraries that need process env values, prefer **factories** or **lazy patterns**",
    ],
    createdAt: "2025-05-28",
    tags: ["#nextjs", "#supabase", "#deployment"],
  },
  {
    id: 5,
    title: "From Bench to Browser: My Dual Identity",
    hook: "Yeast cultures in the morning, TypeScript errors at night.",
    content: [
      "Some days I'm in the lab culturing **yeast strains** and analyzing *citric acid intermediates*. Other days I'm designing **REST APIs** and debugging *TypeScript errors*. Balancing **biochemistry** and **computer science** isn't just academic; it's the intersection of logic and life.",
      "What makes it work? Treating both domains as **systems**. Whether it's:\n\n- *Cellular metabolism* ↔ *Async state updates*\n- *Signal pathways* ↔ *Data flow*\n- *Lab protocols* ↔ *Code structure*\n\nI look for structure, flow, and signals. **Bioinformatics** isn't just my major; it's how I think.",
    ],
    createdAt: "2025-05-28",
    tags: ["#bioinformatics", "#research", "#software"],
  },
  {
    id: 4,
    title: "Bringing Redis Into a Clustered World",
    hook: "Docker was fine. Kubernetes contexts were not.",
    content: [
      "I recently containerized a **Redis instance** to support local data caching for station and call data; and while my *Docker setup* was solid, connecting it to the right **Kubernetes context** gave me trouble.",
      "Eventually, I realized the production environment used **port-forwarded access** to a Redis cluster, while the local instance lacked routing. The fix was less about code and more about understanding *cloud architecture*.\n\n> **Every bug is a systems problem in disguise.**",
    ],
    createdAt: "2025-05-28",
    tags: ["#redis", "#docker", "#kubernetes"],
  },
  {
    id: 3,
    title: "Fullstack Learning Through Real Problems",
    hook: "Building the course planner I wished I had as a student.",
    content: [
      "I'm currently building a **course planner web app** from scratch; not just as a coding exercise, but to solve a real student problem I've faced myself. The goal is to generate a semester-by-semester plan based on a student's major, minors, prerequisites, and graduation requirements.",
      "So far, I've laid the groundwork:\n\n- Setting up the **backend logic** to track prerequisites\n- Designing **MongoDB schemas** for flexible course data\n- Scaffolding the frontend using **React** and **MUI**\n\nThe next step is fine-tuning the UI for *drag-and-drop scheduling* and ensuring that Express auth integrates cleanly across the app.",
      "It's a work in progress, but it's already taught me how **backend decisions affect frontend experience**; and how real user needs can guide architecture. I'm excited to keep iterating and make something truly useful.",
    ],
    createdAt: "2025-05-28",
    tags: ["#fullstack", "#studentlife", "#react"],
  },
  {
    id: 2,
    title: "Why I Integrated Spotify into My Website",
    hook: "Why my site shows what I'm listening to, and how it works.",
    content: [
      "To make my portfolio site more **personal** and **dynamic**, I integrated Spotify's API to show what I'm currently listening to or last played. It's not just a novelty; it reflects who I am, in real time, and adds an interactive edge to my site.",
      "I already understood how **OAuth**, **token refresh**, and **REST APIs** work; I wasn't doing this to learn the tech. I just wanted something running on the backend that made my site feel *alive*. Since I didn't want a bland portfolio that only lived on the frontend, this was the perfect lightweight feature to showcase API integration and background polling.",
      "Setting it up involved:\n\n- Handling **authentication securely**\n- Accounting for **rate limits**\n- Rendering **fallback states** when no track was playing\n\nIt's a small touch, but one that keeps my portfolio technically interesting and personally expressive.",
    ],
    createdAt: "2025-05-27",
    tags: ["#api", "#spotify", "#personalwebsite"],
  },
  {
    id: 1,
    title: "Syncing GitHub Contributions Across Accounts",
    hook: "Getting my John Deere work onto my public GitHub graph without leaking anything.",
    content: [
      "As a **student engineer** working on both enterprise and personal projects, I ran into a frustrating limitation: my work at *John Deere* doesn't show up on my public GitHub profile. I wanted a way to reflect my daily contributions while respecting privacy and access restrictions.",
      "To work around this, I started learning about Git's commit structure, author/committer fields, and how to safely replicate activity using `git commit-tree` and `git rebase --root`. I experimented with:\n\n- **Rewriting commit histories** locally\n- Creating **non-sensitive dummy repos** that mimic my workflow\n- Using **cron jobs** to automate the push process\n- Exploring GitHub's API for contribution detection and timestamp alignment",
      "I haven't perfected the system yet, but I'm actively testing ways to mirror safe commit metadata without exposing actual work. If anyone has experience with syncing **GitHub Enterprise** activity to a public profile in a secure and compliant way, I'd love to connect.",
    ],
    createdAt: "2025-05-27",
    tags: ["#github", "#automation", "#devworkflow"],
  },
];

const WORDS_PER_MINUTE = 200;

export const readingMinutes = (note: Note): number =>
  note.readMinutes ??
  Math.max(1, Math.round(note.content.join(" ").split(/\s+/).length / WORDS_PER_MINUTE));

export const newestFirst = [...notes].sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id - a.id);
