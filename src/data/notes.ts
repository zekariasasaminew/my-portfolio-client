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
    id: 14,
    title: "My first fixes in GitHub Desktop and the React Compiler",
    hook: "Contributing to big open source projects felt like something other people did. Then I fixed a context menu, and later a compiler.",
    content: [
      "For a long time I assumed contributing to huge open source projects was for people who already worked at those companies. Turns out the barrier is smaller than it looks: a clear issue, a small fix, and a PR that makes the reviewer's job easy.\n\nHere's what my first ones looked like, in [GitHub Desktop](https://github.com/desktop/desktop) and Meta's [React Compiler](https://github.com/facebook/react).",
      "## GitHub Desktop: start with what annoys you\n\nI use GitHub Desktop every day, so I went looking through its issue tracker for small things that bugged me too. Each fix I landed was tied to an existing issue:\n\n- **Copilot in the right-click menu.** Desktop could already write a commit message with Copilot, but right-clicking the message box only offered \"Add Co-Authors.\" I added the Copilot option to both context menus when it's available.\n- **Whitespace hint on right-click.** With \"Hide whitespace changes\" on, left-clicking a diff line showed a hint with a button to turn that setting off. Right-clicking showed nothing. Now both behave the same.\n- **Flickering menu bar.** With the profile popover open, clicking File or Edit made the menu flicker and close right away. I added a capture-phase click listener that closes the popover first, so only one thing is open at a time.\n- **Dialogs and the sign-in button.** Cleaned up how dialogs dismiss and how the sign-in button's state updates.\n\nNone of these are big. That's the point. Small, well-scoped fixes with before and after screenshots are easy for maintainers to say yes to.",
      "## React Compiler: a bug in the type erasure gap\n\nThe React Compiler rewrites your components to memoize things automatically. To do that safely it has to know which expressions it can move around (reorder) without changing what your code does.\n\nIt was rejecting this perfectly valid TypeScript:\n\n```tsx\nexport function Component<T = string>({fn = id<T>}: {fn?: (x: T) => T}) {\n  const value = fn('hi' as T);\n  return <div>{String(value)}</div>;\n}\n```\n\nThat `id<T>` is a TypeScript instantiation expression. It only exists for the type checker. Once compiled, it's just `id`. But the compiler didn't recognize it, so it bailed out saying it couldn't safely reorder the default value.\n\nThe fix (trimmed a little here) was a few lines: teach the reorder check that an instantiation expression is reorderable whenever the expression inside it is.\n\n```ts\ncase 'TSInstantiationExpression': {\n  const innerExpr = expr.get('expression');\n  return isReorderableExpression(builder, innerExpr, allowLocalIdentifiers);\n}\n```\n\nPlus a test fixture showing the component now compiles. It got merged in September 2025.",
      "## What I'd tell someone trying their first one\n\n- **Pick a project you actually use.** You already know what's broken and what \"fixed\" should feel like.\n- **Start from an existing issue.** It proves the problem matters to someone besides you, and maintainers already agree it's a bug.\n- **Keep it tiny.** My compiler fix was a handful of lines plus a test. Small PRs get reviewed. Big ones sit.\n- **Show your work.** Screenshots for UI changes, a test or fixture for logic changes, and the exact commands you ran.\n- **Read the code around your change.** The compiler fix was short because the code already had a pattern for this. I just had to find it.\n\nThe first PR is the scary one. After that, it's just another repo.",
    ],
    createdAt: "2026-11-14",
    tags: ["#open-source", "#react", "#typescript", "#github"],
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
