import { useState } from "react";
import { Box, ButtonBase } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import Figure from "./Figure";
import { usePostColors } from "./usePostColors";

const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

type Before = "passes" | "fails" | "no baseline";
type After = "passes" | "fails";

interface Verdict {
  name: string;
  exit: string;
  action: string;
  tone: "good" | "bad" | "neutral";
}

const VERDICTS: Record<Before, Record<After, Verdict>> = {
  passes: {
    passes: { name: "passed", exit: "0", action: "Return the branch.", tone: "good" },
    fails: { name: "regressed", exit: "1 if still failing", action: "The run broke something. Start a repair lane with only the failures, then re-verify.", tone: "bad" },
  },
  fails: {
    passes: { name: "fixed", exit: "0", action: "The run fixed something that was already broken. Return the branch.", tone: "good" },
    fails: { name: "inconclusive", exit: "3", action: "It was already broken before any agent ran. No evidence the run caused it, so no repair.", tone: "neutral" },
  },
  "no baseline": {
    passes: { name: "passed", exit: "0", action: "Return the branch.", tone: "good" },
    fails: { name: "failed", exit: "1 if still failing", action: "Start a repair lane, then re-verify.", tone: "bad" },
  },
};

interface ToggleProps<T extends string> {
  label: string;
  options: T[];
  value: T;
  onChange: (value: T) => void;
}

function Toggle<T extends string>({ label, options, value, onChange }: ToggleProps<T>) {
  const c = usePostColors();
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ fontFamily: MONO, fontSize: "0.72rem", color: c.muted, mb: 0.75, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </Box>
      <Box role="radiogroup" aria-label={label} sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        {options.map((option) => {
          const selected = option === value;
          return (
            <ButtonBase
              key={option}
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option)}
              sx={{
                fontFamily: MONO,
                fontSize: "0.8rem",
                px: 1.5,
                py: 0.6,
                borderRadius: "6px",
                border: `1px solid ${selected ? c.accent : c.line}`,
                color: selected ? c.accent : c.text,
                background: selected ? c.panelStrong : "transparent",
              }}
            >
              {option}
            </ButtonBase>
          );
        })}
      </Box>
    </Box>
  );
}

const VerdictTable = () => {
  const c = usePostColors();
  const [before, setBefore] = useState<Before>("fails");
  const [after, setAfter] = useState<After>("fails");
  const verdict = VERDICTS[before][after];
  const toneColor = verdict.tone === "good" ? c.green : verdict.tone === "bad" ? c.red : c.amber;

  return (
    <Figure
      label="Fig 6"
      title="Every check runs twice. Try it."
      caption="Each --verify command runs on the untouched tree before any lane starts, and again on the combined result. The pair decides the verdict, and the worst verdict across all commands decides the exit code."
    >
      <Box sx={{ display: "flex", gap: { xs: 1, sm: 4 }, flexDirection: { xs: "column", sm: "row" } }}>
        <Box sx={{ flex: 1 }}>
          <Toggle label="before: untouched tree" options={["passes", "fails", "no baseline"] as Before[]} value={before} onChange={setBefore} />
          <Toggle label="after: combined result" options={["passes", "fails"] as After[]} value={after} onChange={setAfter} />
        </Box>
        <Box sx={{ flex: 1, minHeight: 150 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${before}-${after}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Box sx={{ border: `1.5px solid ${toneColor}`, borderRadius: "10px", p: 2, background: c.panelStrong }}>
                <Box sx={{ fontFamily: MONO, fontSize: "0.72rem", color: c.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>verdict</Box>
                <Box sx={{ fontFamily: MONO, fontSize: "1.5rem", fontWeight: 700, color: toneColor, my: 0.5 }}>{verdict.name}</Box>
                <Box sx={{ fontFamily: MONO, fontSize: "0.8rem", color: c.text, mb: 1 }}>exit code: {verdict.exit}</Box>
                <Box sx={{ fontSize: "0.85rem", color: c.muted, lineHeight: 1.55 }}>{verdict.action}</Box>
              </Box>
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>
    </Figure>
  );
};

export default VerdictTable;
