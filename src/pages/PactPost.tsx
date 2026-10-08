import { useEffect } from "react";
import type { ReactNode } from "react";
import { Box, Typography, Divider, Link } from "@mui/material";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Figure from "../components/pact/Figure";
import PipelineDiagram from "../components/pact/PipelineDiagram";
import WorktreeDiagram from "../components/pact/WorktreeDiagram";
import LeaseSequence from "../components/pact/LeaseSequence";
import BenchmarkRace from "../components/pact/BenchmarkRace";
import ProcessVsSession from "../components/pact/ProcessVsSession";
import VerdictTable from "../components/pact/VerdictTable";
import LaneScaling from "../components/pact/LaneScaling";
import ArbiterBench from "../components/pact/ArbiterBench";
import { ARBITER_BENCH } from "../data/arbiterBench";
import { usePostColors } from "../components/pact/usePostColors";

interface PactPostProps {
  toggleColorMode: () => void;
}

const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const REPO = "https://github.com/zekariasasaminew/pact";
const PAGE_TITLE = "The fastest isolation is the one you skip | Zekarias Asaminew";

const STATS = [
  { value: "12", label: "weeks" },
  { value: "28k", label: "lines of Rust" },
  { value: "548", label: "tests" },
  { value: "177", label: "merged PRs" },
  { value: "5", label: "agent CLIs" },
  { value: "7", label: "crates" },
];

const P = ({ children }: { children: ReactNode }) => {
  const c = usePostColors();
  return (
    <Typography component="p" variant="body1" sx={{ maxWidth: "70ch", lineHeight: 1.85, color: c.text, mb: 2.5, fontSize: "1rem" }}>
      {children}
    </Typography>
  );
};

const H2 = ({ id, kicker, children }: { id: string; kicker: string; children: ReactNode }) => {
  const c = usePostColors();
  return (
    <Box id={id} sx={{ mt: { xs: 7, md: 9 }, mb: 2.5, scrollMarginTop: "24px" }}>
      <Box sx={{ fontFamily: MONO, fontSize: "0.75rem", color: c.accent, letterSpacing: "0.06em", textTransform: "uppercase", mb: 1 }}>
        {kicker}
      </Box>
      <Typography component="h2" sx={{ fontSize: { xs: "1.45rem", md: "1.7rem" }, fontWeight: 700, letterSpacing: "-0.015em", lineHeight: 1.25 }}>
        <Link href={`#${id}`} underline="none" sx={{ color: "inherit" }}>
          {children}
        </Link>
      </Typography>
    </Box>
  );
};

const Code = ({ children }: { children: ReactNode }) => {
  const c = usePostColors();
  return (
    <Box component="code" sx={{ fontFamily: MONO, fontSize: "0.86em", px: 0.6, py: 0.15, borderRadius: "4px", background: c.panelStrong, border: `1px solid ${c.line}` }}>
      {children}
    </Box>
  );
};

const CodeBlock = ({ children, label }: { children: string; label?: string }) => {
  const c = usePostColors();
  return (
    <Box sx={{ my: 3, border: `1px solid ${c.line}`, borderRadius: "10px", overflow: "hidden", background: c.panelStrong }}>
      {label && (
        <Box sx={{ px: 2, py: 0.75, borderBottom: `1px solid ${c.line}`, fontFamily: MONO, fontSize: "0.7rem", color: c.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {label}
        </Box>
      )}
      <Box component="pre" sx={{ m: 0, p: 2, overflowX: "auto", fontFamily: MONO, fontSize: "0.8rem", lineHeight: 1.65, color: c.text }}>
        {children}
      </Box>
    </Box>
  );
};

const Callout = ({ children }: { children: ReactNode }) => {
  const c = usePostColors();
  return (
    <Box
      component={motion.blockquote}
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      sx={{ m: 0, my: 4, pl: 2.5, borderLeft: `3px solid ${c.accent}`, fontSize: { xs: "1.1rem", md: "1.25rem" }, fontWeight: 600, lineHeight: 1.5, color: c.text, maxWidth: "60ch" }}
    >
      {children}
    </Box>
  );
};

const Bullets = ({ items }: { items: ReactNode[] }) => {
  const c = usePostColors();
  return (
    <Box component="ul" sx={{ maxWidth: "70ch", pl: 3, mt: 0, mb: 3, color: c.text, "& li": { mb: 1.25, lineHeight: 1.75 } }}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </Box>
  );
};

const ExtLink = ({ href, children }: { href: string; children: ReactNode }) => {
  const c = usePostColors();
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer" sx={{ color: c.accent, textUnderlineOffset: "3px" }}>
      {children}
    </Link>
  );
};

const PactPost = ({ toggleColorMode }: PactPostProps) => {
  const c = usePostColors();

  useEffect(() => {
    const previous = document.title;
    document.title = PAGE_TITLE;
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      sx={{
        minHeight: "100vh",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: { xs: "1.25rem 1rem", sm: "2rem", md: "4rem" },
        color: c.text,
        position: "relative",
        zIndex: 1,
      }}
    >
      <Navbar toggleColorMode={toggleColorMode} />

      <Box component="article" sx={{ maxWidth: "800px", mx: "auto" }}>
        <Box component="header" sx={{ mb: 4 }}>
          <Box sx={{ fontFamily: MONO, fontSize: "0.76rem", letterSpacing: "0.06em", textTransform: "uppercase", color: c.accent, mb: 1.5 }}>
            pact · Rust · multi-agent orchestration · October 2026
          </Box>
          <Typography component="h1" sx={{ fontSize: { xs: "2rem", md: "2.8rem" }, fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.1, mb: 2.5 }}>
            The fastest isolation is the one you skip
          </Typography>
          <Typography component="p" sx={{ fontSize: { xs: "1.05rem", md: "1.2rem" }, lineHeight: 1.6, color: c.muted, maxWidth: "62ch" }}>
            I spent twelve weeks building pact, a Rust CLI that runs Claude Code, Copilot CLI, Codex, Gemini CLI and Antigravity on one repository at the same time and hands back one verified branch. My first architecture was 3.4x slower than Copilot's own sub-agents. A series of measured changes later it finished the same task 21% faster, 21% cheaper, on half the memory. Then I pointed its conflict resolver at 44 real merge conflicts from Click and Flask: it fully resolved 68% of them, and the tests could not tell which 32% it got wrong. This is the whole arc, with the numbers.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mt: 3, flexWrap: "wrap", fontFamily: MONO, fontSize: "0.8rem" }}>
            <ExtLink href={REPO}>github.com/zekariasasaminew/pact</ExtLink>
            <ExtLink href={`${REPO}/blob/main/DESIGN.md`}>DESIGN.md (5,400 lines)</ExtLink>
            <ExtLink href={`${REPO}/issues/308`}>benchmark data</ExtLink>
            <ExtLink href={`${REPO}/tree/main/bench/arbiter`}>real-conflict benchmark</ExtLink>
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(3, 1fr)", sm: "repeat(6, 1fr)" },
            border: `1px solid ${c.line}`,
            borderRadius: "12px",
            overflow: "hidden",
            mb: 2,
          }}
        >
          {STATS.map((stat, i) => (
            <Box
              key={stat.label}
              component={motion.div}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              sx={{ p: { xs: 1.5, md: 2 }, textAlign: "center", borderRight: `1px solid ${c.line}`, borderBottom: { xs: `1px solid ${c.line}`, sm: "none" } }}
            >
              <Box sx={{ fontFamily: MONO, fontSize: { xs: "1.2rem", md: "1.5rem" }, fontWeight: 700, color: c.accent }}>{stat.value}</Box>
              <Box sx={{ fontSize: "0.72rem", color: c.muted }}>{stat.label}</Box>
            </Box>
          ))}
        </Box>

        <Figure
          label="Fig 1"
          title="pact run: one task in, one verified branch out"
          minContentWidth={480}
          caption="Where pact ended up. A planner splits the task into units that own disjoint files while the shared tree and the verification baselines are prepared in parallel. Every unit runs as a session inside one agent process. pact commits once, judges every check against the untouched tree, and repairs what regressed."
        >
          <PipelineDiagram />
        </Figure>

        <H2 id="problem" kicker="01 · the problem">Agents are good alone and bad together</H2>
        <P>
          Coding agent CLIs are good at one task in one checkout. Put two in the same folder and they fight: both edit the same file, one runs <Code>npm install</Code> while the other runs the tests, both stage into the same git index. Give them separate clones and you pay for N copies of <Code>node_modules</Code>, then a merge at the end that nobody owns.
        </P>
        <P>
          I wanted one command. Hand it a task, let it fan the work out to whatever agents are installed, get back one branch that builds. Everything below is how that command changed as I measured it.
        </P>

        <H2 id="v1" kicker="02 · version one">The obvious design: a worktree per agent</H2>
        <P>
          The first version did what everyone does. Every agent gets its own <Code>git worktree</Code> on its own branch, so nothing it does can touch another agent's files. Dependencies are linked from the main checkout instead of reinstalled. When the agents finish, <Code>merge-all</Code> lands their branches one by one on a fresh integration branch, and your own checkout is never touched.
        </P>

        <WorktreeDiagram />

        <P>The merge was where most of the engineering went:</P>
        <Bullets
          items={[
            <>Smallest diff first, so the cheap wins land before the risky ones. A workspace whose recorded base commit is no longer an ancestor of <Code>HEAD</Code> is refused rather than merged against a moving target.</>,
            <>Dependency tables in <Code>package.json</Code>, <Code>Cargo.toml</Code> and <Code>pyproject.toml</Code> merge as parsed data, not text. Two agents adding two different packages is not a conflict. Lockfiles are never auto-resolved.</>,
            <>A conflicting workspace is skipped, not aborted, and persisted. <Code>pact resolve</Code> retries it later against the same branch with the same merge code, because git already keeps everything needed to reconstruct it.</>,
            <>An opt-in test gate (<Code>--require-passing-tests</Code>) runs your test command after each merge and rolls that merge back with <Code>git reset --hard</Code> if it fails.</>,
            <>Arbiter, an optional one-shot agent, proposes a resolution for conflicts the rules could not handle, and the proposal is kept only if the test command passes afterwards.</>,
          ]}
        />
        <P>
          For coordination while agents run, pact mounts an MCP server, <Code>pact-coord</Code>, into every agent. It exposes seven tools: claim and release files, send and check messages, and a typed handoff protocol. Leases are advisory on purpose. A lock that an LLM can misread is worse than a signal it reads correctly.
        </P>

        <LeaseSequence />

        <CodeBlock label="claim_files response, the field I had to rename">{`{
  "accepted": true,
  "expires_at": 1759622400,
  "has_conflicts": true,
  "conflicts": [
    { "holder": "agent-a", "pattern": "src/auth/*.ts",
      "example_files": ["src/auth/session.ts"] }
  ]
}`}</CodeBlock>
        <P>
          That first field used to be called <Code>granted</Code>. An agent reading <Code>granted: true</Code> next to a list of conflicts assumes it owns the file. Renaming it was a breaking change to a public wire format, and it shipped in a minor release with a warning at the top of the notes, because the old name was producing wrong behaviour.
        </P>

        <H2 id="reality" kicker="03 · real agents">Nothing is verified until a real agent touches it</H2>
        <P>
          Every test in CI runs against fake agents, which is how it should be: fast, free, deterministic. Then I spent a day running about 45 real Claude Code sessions through pact, and the first finding was that the coordination feature, the main thing pact offered, had never worked with a default-config Claude Code agent. The adapter's tool allowlist did not include <Code>mcp__pact-coord__*</Code>, so every claim was silently denied by Claude's own permission gate. The server was up, the tools were registered, and no agent could call them.
        </P>
        <P>That day and the ones after it produced a list I could not have written from reading the code:</P>
        <Bullets
          items={[
            <>Arbiter went 0 for 6 on simple conflicts. Each time the agent described the correct resolution in plain text, then said it needed permission to edit, even under <Code>bypassPermissions</Code>. The cause was not permissions at all: the file was in git's unmerged <Code>UU</Code> state, and the repository still had a <Code>MERGE_HEAD</Code>. Temporarily collapsing the index entry, and later the repo-wide merge state, then restoring it exactly on rejection, took it to 4 for 4.</>,
            <>A PID lock trusted a PID that the OS had recycled for an unrelated process. Locks now record the process start time and require both to match.</>,
            <>PowerShell's <Code>Out-File -Encoding utf8</Code> writes a byte order mark, which broke the JSON-aware <Code>package.json</Code> merge. The first fix stripped the BOM and never put it back, silently rewriting the file's encoding on every merge.</>,
            <>Gemini CLI's <Code>--approval-mode yolo</Code> quietly downgrades to interactive in a directory it has not been told to trust. In a headless run that is a hang with no error.</>,
            <>A crashed <Code>pact</Code> orphaned its agent's whole process tree, and on Windows a pipe inherited by a grandchild kept the stream open after the child exited.</>,
          ]}
        />

        <H2 id="benchmark" kicker="04 · the benchmark">The benchmark that broke my design</H2>
        <P>
          By the end of September pact had five adapters, a merge engine and a coordination server. What it did not have was evidence that any of it was faster than the alternative. So I built a benchmark kit: take a real Next.js app from zero tests to tests for 39 listed files with per-file coverage floors, no source edits, acceptance by <Code>npm test</Code>, type-check, lint and coverage. Same model for every agent, same base commit, same laptop. The control arm got the same task with no mention of pact, and Copilot chose on its own to fan out to eight in-process sub-agents in one working tree.
        </P>
        <P>
          The first result: pact took 53.8 minutes. Copilot took 15.8. pact used 4x the CPU and cost 60% more. Quality was a tie, slightly in pact's favour, which did not come close to justifying 3.4x the time.
        </P>
        <P>
          Where it went: every merge had been conflict-free, because I had split the units by file. The worktrees protected against nothing. pact then paid for the sequenced merge and eleven full test-suite runs on top. And it was capped at three lanes, because each worker was its own 400 MB process with its own cold type-checker warm-up, and the memory floor on a 14 GB laptop would not admit a fourth.
        </P>

        <Callout>For units that own disjoint files, isolation and the merge are pure overhead.</Callout>

        <BenchmarkRace />

        <H2 id="shared-tree" kicker="05 · shared tree">Arm S: delete the isolation</H2>
        <P>
          I prototyped the opposite: the same lean workers, the same briefs, one shared checkout. 26.7 minutes, at equal or better quality, with zero collisions between eight agents writing concurrently. Not one lease was needed, because the briefs were disjoint.
        </P>
        <P>
          <Code>spawn-many --shared-tree</Code> turned that into a strategy pact offers. A lane is still a workspace in every sense pact already had: its own id, log, agent process and coordination identity. The only difference is that its path and branch belong to a batch, and one field, <Code>shared_batch</Code>, is what the rest of the system keys on. Nothing per-lane had to be rewritten. Because a shared tree has no isolation to absorb a mistake, the overlap heuristic that was a warning in isolated mode became a refusal, and every lane's brief starts with the same rules: claim before you write, stop on <Code>has_conflicts</Code>, no installs or builds.
        </P>

        <H2 id="acp" kicker="06 · one process">The rest of the gap was process startup</H2>
        <P>
          The shared tree still took 31 minutes against Copilot's 15.8, and the profile said why. Copilot's sub-agents run inside one process. pact's lanes were eight cold processes. I measured it directly:
        </P>

        <ProcessVsSession />

        <P>
          The fix was a protocol instead of a parser. The <ExtLink href="https://agentclientprotocol.com">Agent Client Protocol</ExtLink> lets one agent process host many independent sessions, each with its own working directory and its own MCP servers, which is exactly a pact lane. I wrote <Code>pact-acp</Code>, a small JSON-RPC client for the subset pact needs, and ran <Code>pact-coord</Code> in-process over streamable HTTP with one route per lane, so every session still gets its own coordination identity.
        </P>
        <CodeBlock label="per lane, inside one copilot --acp process">{`pact  -> agent  initialize                       (once, about 2 s)
pact  -> agent  session/new   cwd=<shared tree>  mcp=/lanes/<lane>
pact  -> agent  session/prompt <the unit's brief>
agent -> coord  claim_files, check_messages, release_files
agent -> pact   session/update stream  -> logs/<lane>.jsonl`}</CodeBlock>
        <P>
          Anything the agent sends that pact does not model travels as raw JSON instead of being dropped. Cancelling one lane cannot mean killing the shared process, so teardown writes a cancel marker that the process owning the agent's stdin turns into <Code>session/cancel</Code>. Arm Q, the same benchmark on this runtime: 17.2 minutes, 45% less mean memory than Copilot's own sub-agents, and the most tests at the highest coverage of any arm.
        </P>

        <H2 id="pact-run" kicker="07 · pact run">Move the judgement inside the tool</H2>
        <P>
          Execution was now cheap, but a human was still writing the plan. The benchmark needed a 2.4 KB prompt header to get a general agent to orchestrate acceptably, and every rule in it was something pact already knew: disjoint ownership per unit, conventions repeated in every brief, do not commit, verify on the result. <Code>pact run</Code> moved that loop inside.
        </P>
        <P>
          A planner session reads the repository and writes a JSON plan. <Code>validate_plan</Code> is a pure function that names every violation in words the planner can act on: a file owned by two units, duplicate names, absolute or <Code>..</Code> paths, too many units. Violations go back to the planner with the previous plan. A planner that modified the repository is refused outright, because planning is read-only by contract.
        </P>
        <CodeBlock label="the whole interface">{`pact run --agent copilot --verify "npm test" --verify "npm run lint" \\
  "Add Vitest tests for every module under lib/"`}</CodeBlock>
        <P>
          Arm R, the first run where nobody wrote a brief, came in at 16.3 minutes. The planner's own session log then showed where its time went. Of 127 seconds of planning, 6 were a tool call and 117 were generating a 26 KB reply that restated the task to every worker, who already received the task verbatim. Generation runs at about 40 tokens a second whatever is being generated, so every restated line was pure delay. The prompt now says that, and tells the planner to balance units by effort instead of file count and to name an existing test file for each unit to imitate. Arm R2, with those changes: 12.5 minutes. After that, briefs shrank to two or three sentences, and the shared tree, dependency prep and baselines stopped waiting on the planner, since none of them depend on the plan.
        </P>

        <H2 id="baselines" kicker="08 · verdicts">A failing check is not a verdict</H2>
        <P>
          The first live <Code>pact run</Code> did the work correctly in 90 seconds and then failed verification. Next.js generates its route types into a gitignored folder that no fresh worktree has, so the type-check failed before any agent had touched anything. Both workers had written "pre-existing, unrelated" in their summaries. pact had no way to know.
        </P>
        <P>So every verify command now runs twice, and the pair decides:</P>

        <VerdictTable />

        <P>
          The baseline runs in the batch tree, not your checkout, precisely because your checkout may hold generated files the tree lacks. A baseline taken in the repo root would have called that first run a regression.
        </P>

        <H2 id="lanes" kicker="09 · scaling">Twelve lanes were no faster than eight</H2>
        <P>
          With the plan inside pact, the last number a human still set was how many units to ask for. pact now sizes it from the machine, using the same admission check that decides whether another lane can launch. On my laptop that said twelve. Twelve lanes took 12.4 minutes against eight lanes' 12.5, and cost 19% more.
        </P>

        <LaneScaling />

        <P>
          Finer splitting multiplied the whole-project checks and bought nothing, because the model-bound part of a lane was never the bottleneck. The fix is a division of labour: workers check only their own files, and pact runs the project-wide checks once, on the combined result. A regressed or failed verdict starts one repair lane in the same tree, with only the real failures, their output, and the files the run touched.
        </P>

        <H2 id="limits" kicker="10 · the honest part">What one good run does not prove</H2>
        <P>
          On the 1st of October pact beat the tool it was compared against: 12.5 minutes against 15.8, $12.79 against $16.20, half the mean memory, nobody writing a brief. The next day I ran a back-to-back pair on a weaker model, and it went the other way: Copilot's sub-agents 51.3 minutes, <Code>pact run</Code> 70.8, and neither finished cleanly. Every row in that chart is a single run on one laptop.
        </P>
        <P>
          So the result is a direction, not a verdict. The vendors are shipping their own fan-out too: Claude has agent teams, Copilot has <Code>/fleet</Code>, Codex has sub-agents, Cursor runs parallel agents. What pact has to show is that owning the split, the shared runtime and the baseline beats them on more than one model and more than one task. The open problems are on GitHub: units that depend on each other and need waves (<ExtLink href={`${REPO}/issues/282`}>#282</ExtLink>), Ctrl-C leaving agent processes behind (<ExtLink href={`${REPO}/issues/366`}>#366</ExtLink>), workers shipping code a shared incremental check would have caught (<ExtLink href={`${REPO}/issues/371`}>#371</ExtLink>), repairs that should run in parallel (<ExtLink href={`${REPO}/issues/372`}>#372</ExtLink>), and Copilot silently swapping the model under every lane (<ExtLink href={`${REPO}/issues/374`}>#374</ExtLink>). The benchmark itself needs repeated runs, not single ones.
        </P>

        <H2 id="arbiter" kicker="11 · real conflicts">Arbiter vs {ARBITER_BENCH.cases} real merge conflicts</H2>
        <P>
          One question was still open. Arbiter, the one-shot agent that resolves what the merge rules cannot, had only ever seen conflicts I wrote by hand. So I mined the real thing: every merge in the 2021 to 2026 history of Click and Flask that git could not finish on its own. Each one is replayed in a scratch worktree, and Arbiter gets exactly what it gets inside pact: BASE, OURS, THEIRS and the incoming branch's commit messages. The maintainers' own merge commit is the answer key it never sees.
        </P>

        <ArbiterBench />

        <P>
          30 of the {ARBITER_BENCH.cases} resolutions kept every change the maintainers kept, and 21 of those are exactly what the maintainers committed. The naive strategies are not close: always taking OURS gets 10 right, always taking THEIRS gets 9. Counted by lines, Arbiter carried 89% of the changes the maintainers kept, against 44% and 60% for the two sides.
        </P>

        <Callout>The tests passed every merge that lost work.</Callout>

        <P>
          The other 14 matter more. Each one silently dropped a change, usually one of two changelog entries that both branches added at the same spot, and pact would have accepted every one, because pact keeps an Arbiter resolution when the test command passes. 35 cases had a test suite that ran. It passed all 35 Arbiter resolutions, including the 12 that lost work, and it also passed 33 of 35 merges that just took OURS. Tests check behaviour, and the lines in a conflict are almost never what the tests exercise.
        </P>
        <P>
          So I tried a gate that needs no answer key. List the lines each side added relative to BASE, and require every line from a hunk that either did not collide with the other side or replaced nothing, like a new changelog entry. On the same cases it flagged 10 of the 14 lossy merges and 1 of the 30 good ones. Requiring every added line catches 13 of 14 but flags 19 of 30 good merges, because where both sides rewrote the same line, keeping one version is the correct answer.
        </P>
        <P>What {ARBITER_BENCH.cases} cases can and cannot say:</P>
        <Bullets
          items={[
            <>The share fully resolved is likely between {ARBITER_BENCH.ci95.faithful[0]}% and {ARBITER_BENCH.ci95.faithful[1]}% on conflicts like these, and the share that silently lost work between {ARBITER_BENCH.ci95.partial[0]}% and {ARBITER_BENCH.ci95.partial[1]}% (95% intervals). Wide, but even the low end of the second range is too high to merge unattended.</>,
            <>The preservation gate's catch rate is likely between {ARBITER_BENCH.ci95.gateCaught[0]}% and {ARBITER_BENCH.ci95.gateCaught[1]}%, with false alarms between {ARBITER_BENCH.ci95.gateFalse[0]}% and {ARBITER_BENCH.ci95.gateFalse[1]}%. Promising, not proven.</>,
            <>These are two Python projects with a merge-heavy workflow, so changelog and version-file conflicts dominate. 20 of the 44 touched source code: 15 kept every change, 5 lost one.</>,
          ]}
        />
        <P>
          The benchmark also found a bug in pact itself. Arbiter treated any file containing seven equals signs as having leftover conflict markers, and reStructuredText underlines headings with exactly that, so every RST file with a long enough heading was unresolvable. 5 of the 105 conflicts I mined would have hit it. Git's real markers always open a line with <Code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</Code> or <Code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</Code>, so the check now looks for exactly that, with regression tests, in <ExtLink href={`${REPO}/pull/381`}>PR #381</ExtLink>.
        </P>
        <Callout>Producing a resolution is the easy part. Knowing when to trust it is the product.</Callout>

        <H2 id="lessons" kicker="12 · what I keep">What I am taking with me</H2>
        <Bullets
          items={[
            <><strong>Measure before you architect.</strong> The worktree design was correct for a problem my workload did not have. One benchmark run disproved two months of assumptions in an hour.</>,
            <><strong>Isolation is a cost, not a virtue.</strong> Pay for it when the work actually overlaps, and know which case you are in before anything spawns.</>,
            <><strong>Startup dominates.</strong> Eight processes versus eight sessions was 50.9 s against 5.6 s. Protocols that let you reuse a process beat parsers that wrap one.</>,
            <><strong>A check without a baseline is an opinion.</strong> Run it on the untouched tree first.</>,
            <><strong>Read the agent's own logs.</strong> Planner restating, lanes type-checking the world, Arbiter refusing a <Code>UU</Code> file: every big win came from a session log, not from the code.</>,
            <><strong>A test suite is not a merge gate.</strong> It passed every resolution that silently dropped work. Check a merge against what both sides changed, not only against what the code does.</>,
            <><strong>Fake agents for CI, real agents for truth.</strong> The headline feature was unreachable for the first nine days after release, and every test was green.</>,
          ]}
        />

        <Figure label="Fig 9" title="pact demo: real output, no agent calls, about five seconds">
          <Box
            component="img"
            src="/images/pact/demo.gif"
            alt="Terminal recording of pact demo creating two workspaces, listing them, and merging them onto one branch."
            loading="lazy"
            sx={{ width: "100%", display: "block", borderRadius: "6px" }}
          />
        </Figure>

        <CodeBlock label="try it">{`brew tap zekariasasaminew/pact && brew install pact   # or a binary from Releases
pact doctor
pact demo
pact run --agent copilot --dry-run "Add tests for every module under lib/"`}</CodeBlock>

        <P>
          The code, the 5,400-line design log with every measurement behind every decision, and the raw benchmark data are all public. If you are building in this space, the most useful thing in the repo is probably <ExtLink href={`${REPO}/blob/main/DESIGN.md`}>DESIGN.md</ExtLink>: it records what I tried, what the numbers said, and what I changed because of them. pact is still moving, and the next round of work comes from the issues above and from whoever tries it: if it breaks on your repo, <ExtLink href={`${REPO}/issues`}>open an issue</ExtLink>.
        </P>

        <Divider sx={{ my: 5, borderColor: c.line }} />
        <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 2, fontSize: "0.85rem", color: c.muted, pb: 4 }}>
          <span>Zekarias Asaminew · October 2026</span>
          <Box sx={{ display: "flex", gap: 2 }}>
            <ExtLink href={REPO}>GitHub</ExtLink>
            <Link href="/notes" sx={{ color: "inherit" }}>
              More notes
            </Link>
            <Link href="/" sx={{ color: "inherit" }}>
              Home
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PactPost;
