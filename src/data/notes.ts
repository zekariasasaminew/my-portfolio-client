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
    id: 10,
    title: "I didn't want to upgrade my IDE, so I wrote an ACP plugin in a weekend",
    hook: "JetBrains shipped agent support for 2025.3.2 and up. I was on 2024.2. One weekend of Kotlin later, I wasn't stuck anymore.",
    content: [
      "Quick background. **ACP** is the Agent Client Protocol: a standard way for an editor to talk to an AI coding agent like Claude Code, Gemini CLI, Codex, or Copilot CLI. The editor speaks ACP, the agent speaks ACP, and you get a chat panel that can read your files and propose edits without each editor writing a custom integration per agent.\n\nJetBrains added official ACP support, which is great, except it needs **IDE 2025.3.2 or newer**. My IntelliJ was on 2024.2 and I didn't feel like upgrading everything that weekend. So I built my own client instead. That's **jetbrains-acp** (the plugin calls itself AgentPort), and it's open source on [GitHub](https://github.com/zekariasasaminew/jetbrains-acp).",
      "## What it does\n\n- Finds ACP agents already on your PATH: Claude Code, Gemini CLI, Copilot CLI, Codex, OpenCode, Goose, Aider, and more.\n- Has a registry browser for 20+ agents from the official ACP registry. Agents published to npm launch through `npx`, so you don't even have to install them first.\n- Streams the reply as it arrives, and shows the agent's thoughts and tool calls while it works.\n- Lets you switch models mid-session when the agent supports it.\n- Shows proposed edits in IntelliJ's own diff viewer, and asks for permissions in a native IntelliJ dialog.\n- Works on **2024.2 and up**, which was the whole point.\n\nIt's about 1,350 lines of Kotlin, tests included. No Electron, no embedded browser. Plain Swing, so it looks like it shipped with the IDE.",
      "## How the weekend went\n\nSaturday evening: scaffold, agent detection, the ACP client, a chat panel, the diff viewer, the permission dialog, a settings page, and CI. I kept every piece in its own small PR, which made it way easier to find what broke later.\n\nSunday: making it feel good. Message bubbles, markdown rendering, Enter to send, a thinking indicator, the model picker, and the registry browser.\n\nThen the bugs showed up, and they were the fun part.",
      "## Bug 1: it wouldn't even install\n\nI had set the minimum supported build to `243`, which is 2024.3, one version newer than the IDE I was running. Very funny for a plugin whose entire reason to exist is supporting older IDEs. Lowering `sinceBuild` to `242` (2024.2) fixed it.",
      "## Bug 2: Windows couldn't find any agent\n\nEvery agent showed up as detected, then failed to start. On Windows, tools installed through npm are really `.cmd` files, and Java's `ProcessBuilder` doesn't resolve those by bare name the way your terminal does. The fix: if the command is a bare name on Windows, run it through `cmd /c`.\n\n```kotlin\nval actualCommand = if (isWindows && !command.first().contains(File.separatorChar)) {\n    listOf(\"cmd\", \"/c\") + command\n} else {\n    command\n}\n```",
      "## Bug 3: CSS crashed the chat\n\nThe chat panel renders HTML through Swing's built-in HTML support, which understands a pretty old subset of CSS. I had written `line-height` and `border-radius` like any normal web developer, and the Swing parser threw a `NullPointerException` instead of ignoring them. Deleting those two properties fixed it. Lesson: Swing's HTML is closer to 1999 than to a browser.",
      "## What I took from it\n\nYou don't have to wait for the official version. A protocol with a clear spec means a small client is a weekend project, not a quarter. And the bugs that eat your time are almost never in the protocol. They're in the platform around it: build versions, how Windows launches processes, what a 20-year-old HTML renderer is willing to parse.\n\nIf you're on an older JetBrains IDE and want agents in it, grab the zip from the releases page, or clone it and run `./gradlew runIde`.",
    ],
    createdAt: "2026-11-14",
    tags: ["#kotlin", "#jetbrains", "#ai-agents", "#open-source", "#acp"],
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
