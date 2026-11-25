import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Link, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import SpotifyNowPlaying from "../components/SpotifyNowPlaying";
import AboutSection from "../components/home/AboutSection";
import ExperienceSection from "../components/home/ExperienceSection";
import GithubContributions from "../components/home/GithubContributions";
import ProjectsSection from "../components/home/ProjectsSection";
import SkillsSection from "../components/home/SkillsSection";
import { PIXEL_EXCLUDE_ATTR } from "../components/pixelGrid/blockers";
import { GITHUB_CONTRIBUTIONS_FALLBACK } from "../data/githubContributionsFallback";
import { contact, impactStats } from "../data/facts";
import type { ContributionScaleMode } from "../types/contributions";

type Placement = "below-hero" | "above-projects" | "in-projects";

const MONO =
  '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

const PLACEMENTS: readonly { id: Placement; label: string }[] = [
  { id: "below-hero", label: "Below hero" },
  { id: "above-projects", label: "Above projects" },
  { id: "in-projects", label: "In projects" },
];

const GithubPreview = () => {
  const theme = useTheme();
  const accent = theme.palette.mode === "dark" ? "#7fd8a6" : "#0a8f4f";

  const [placement, setPlacement] = useState<Placement>("below-hero");
  const [scaleMode, setScaleMode] = useState<ContributionScaleMode>("perceptual");
  const [showWeeklyBars, setShowWeeklyBars] = useState(true);
  const [showHeroChip, setShowHeroChip] = useState(true);
  const [controlsOpen, setControlsOpen] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 768,
  );
  const [summary, setSummary] = useState({
    total: GITHUB_CONTRIBUTIONS_FALLBACK.total,
    streak: GITHUB_CONTRIBUTIONS_FALLBACK.stats.currentStreak,
  });

  useEffect(() => {
    document.title = "GitHub Contributions Preview | Zekarias Asaminew";
  }, []);

  const handleSummaryChange = useCallback(
    (next: { total: number; streak: number }) => {
      setSummary(next);
    },
    [],
  );

  const LinkStyle = {
    color: "inherit",
    textDecoration: "underline",
    textDecorationColor:
      theme.palette.mode === "dark"
        ? "rgba(120, 255, 180, 0.45)"
        : "rgba(0, 180, 90, 0.32)",
    textDecorationThickness: "2px",
    textUnderlineOffset: "3px",
    padding: "0 2px",
    margin: "0 -2px",
    borderRadius: "2px",
    transition: "all 0.2s ease",
    "&:hover": {
      textDecorationColor:
        theme.palette.mode === "dark"
          ? "rgba(120, 255, 180, 0.7)"
          : "rgba(0, 180, 90, 0.55)",
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(120, 255, 180, 0.28)"
          : "rgba(0, 180, 90, 0.22)",
    },
  };

  const graph = (
    <GithubContributions
      embedded={placement === "in-projects"}
      scaleMode={scaleMode}
      showWeeklyBars={showWeeklyBars}
      onSummaryChange={handleSummaryChange}
    />
  );

  const toggleButtonSx = (active: boolean) => ({
    all: "unset" as const,
    boxSizing: "border-box" as const,
    cursor: "pointer",
    touchAction: "manipulation",
    fontFamily: MONO,
    fontSize: "0.72rem",
    fontWeight: 500,
    px: 1.1,
    minHeight: "28px",
    display: "inline-flex",
    alignItems: "center",
    borderRadius: "6px",
    color: active ? "#0e1912" : "rgba(255, 255, 255, 0.7)",
    bgcolor: active ? accent : "rgba(255, 255, 255, 0.04)",
    border: `1px solid ${active ? accent : "rgba(255, 255, 255, 0.1)"}`,
    transition: "background-color 150ms ease-out, color 150ms ease-out",
    "@media (hover: hover)": {
      "&:hover": {
        borderColor: accent,
        color: active ? "#0e1912" : "rgba(255, 255, 255, 0.95)",
      },
    },
    "&:focus-visible": {
      outline: `2px solid ${accent}`,
      outlineOffset: "2px",
    },
  });

  return (
    <>
      <Box
        component="main"
        sx={{
          minHeight: "100svh",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: { xs: "2rem", md: "4rem" },
          color: theme.palette.text.primary,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Navbar />

        {/* Hero (exact clone of Home) */}
        <Box
          component="section"
          sx={{
            minHeight: { xs: "auto", sm: "82svh" },
            mb: { xs: 14, md: 8 },
            mt: { xs: 5, md: 8 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            sx={{
              fontSize: { xs: "2.1rem", md: "2.8rem" },
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              mb: 1,
            }}
          >
            hi, i'm zekarias
            <Box component="span" sx={{ color: accent }}>
              .
            </Box>
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: "1.15rem", md: "1.4rem" },
              fontWeight: 400,
              color: theme.palette.text.secondary,
              mb: 2.5,
            }}
          >
            i build agentic ai systems.
          </Typography>

          <Typography
            variant="body1"
            component="div"
            sx={{
              mb: 3,
              lineHeight: 1.7,
              fontSize: "1.05rem",
              color: theme.palette.text.secondary,
              maxWidth: "50ch",
              mx: "auto",
            }}
          >
            Software engineer, most recently building agents at{" "}
            <Link href="https://www.ey.com" target="_blank" sx={LinkStyle}>
              EY
            </Link>
            . Before that,{" "}
            <Link href="https://www.deere.com" target="_blank" sx={LinkStyle}>
              John Deere
            </Link>
            , where I shipped a pipeline that traces production alerts back to
            the responsible git commit and opens the fix as a draft PR.
          </Typography>

          {/* Impact strip */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 1,
              mb: 3,
            }}
          >
            {showHeroChip && (
              <Box
                component="a"
                href="#github"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("github")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.7,
                  px: 1,
                  py: 0.25,
                  borderRadius: 0.75,
                  fontSize: "0.7rem",
                  letterSpacing: "0.3px",
                  fontFamily: MONO,
                  fontVariantNumeric: "tabular-nums",
                  textDecoration: "none",
                  border: `1px solid ${alpha(accent, 0.42)}`,
                  bgcolor: alpha(accent, 0.08),
                  color: accent,
                  lineHeight: 1.6,
                  transition: "background-color 160ms ease-out, border-color 160ms ease-out",
                  "@media (hover: hover)": {
                    "&:hover": {
                      bgcolor: alpha(accent, 0.16),
                      borderColor: accent,
                    },
                  },
                  "&:focus-visible": {
                    outline: `2px solid ${accent}`,
                    outlineOffset: "2px",
                  },
                }}
              >
                <Box
                  component="span"
                  aria-hidden
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "1.5px",
                    bgcolor: accent,
                    flexShrink: 0,
                  }}
                />
                {summary.total.toLocaleString()} contributions · 1y
              </Box>
            )}
            {impactStats.map((stat) => (
              <Box
                key={stat}
                component="span"
                sx={{
                  display: "inline-block",
                  px: 1,
                  py: 0.25,
                  borderRadius: 0.75,
                  fontSize: "0.7rem",
                  letterSpacing: "0.3px",
                  fontFamily: "monospace",
                  border: `1px solid ${alpha(theme.palette.text.primary, 0.15)}`,
                  color: theme.palette.text.secondary,
                  lineHeight: 1.6,
                }}
              >
                {stat}
              </Box>
            ))}
          </Box>

          {/* Social Links */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mb: 4,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Link
              href="https://github.com/zekariasasaminew"
              aria-label="GitHub"
              target="_blank"
              rel="noopener"
              sx={{ ...LinkStyle, display: "flex", alignItems: "center" }}
            >
              <GitHubIcon />
            </Link>
            <Link
              href="https://linkedin.com/in/zekarias-asaminew"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener"
              sx={{ ...LinkStyle, display: "flex", alignItems: "center" }}
            >
              <LinkedInIcon />
            </Link>
            <Link
              href={`mailto:${contact.email}`}
              aria-label="Email"
              sx={{ ...LinkStyle, display: "flex", alignItems: "center" }}
            >
              <EmailOutlinedIcon />
            </Link>
          </Box>

          <SpotifyNowPlaying />
        </Box>

        {placement === "below-hero" && graph}
        <AboutSection />
        <ExperienceSection />
        {placement === "above-projects" && graph}
        <ProjectsSection headerSlot={placement === "in-projects" ? graph : undefined} />
        <SkillsSection />

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            pt: 3,
            borderTop: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary, opacity: 0.85 }}
          >
            © {new Date().getFullYear()} Zekarias Asaminew
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary, opacity: 0.85 }}
          >
            More:{" "}
            <Link href="/notes" sx={{ color: "inherit" }}>
              Notes
            </Link>
            {" · "}
            <Link href="/ey-internship" sx={{ color: "inherit" }}>
              The EY Story
            </Link>
            {" · "}
            <Link href="/blog/pact" sx={{ color: "inherit" }}>
              Building pact
            </Link>
          </Typography>
        </Box>
      </Box>

      {/* Preview-only floating controls to compare placement and options */}
      <Box
        {...{ [PIXEL_EXCLUDE_ATTR]: "" }}
        aria-label="Preview options"
        sx={{
          position: "fixed",
          left: { xs: "auto", md: "50%" },
          right: { xs: 14, md: "auto" },
          bottom: { xs: 14, md: 18 },
          transform: { xs: "none", md: "translateX(-50%)" },
          zIndex: 20,
          maxWidth: "calc(100vw - 28px)",
        }}
      >
        {controlsOpen ? (
          <Box
            sx={{
              bgcolor: "#141414",
              border: "1px solid rgba(255, 255, 255, 0.14)",
              borderRadius: "10px",
              px: 1.5,
              py: 1,
              boxShadow: "0 12px 32px rgba(0, 0, 0, 0.55)",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 0.75,
            }}
          >
            <Typography
              sx={{
                fontFamily: MONO,
                fontSize: "0.7rem",
                color: accent,
                fontWeight: 600,
                mr: 0.5,
              }}
            >
              preview
            </Typography>

            {PLACEMENTS.map((p) => (
              <Box
                key={p.id}
                component="button"
                type="button"
                aria-pressed={placement === p.id}
                onClick={() => {
                  setPlacement(p.id);
                  window.requestAnimationFrame(() => {
                    document
                      .getElementById("github")
                      ?.scrollIntoView({ behavior: "smooth", block: "center" });
                  });
                }}
                sx={toggleButtonSx(placement === p.id)}
              >
                {p.label}
              </Box>
            ))}

            <Box
              aria-hidden
              sx={{
                width: "1px",
                height: "18px",
                bgcolor: "rgba(255, 255, 255, 0.12)",
                mx: 0.25,
                display: { xs: "none", sm: "block" },
              }}
            />

            <Box
              component="button"
              type="button"
              aria-pressed={scaleMode === "perceptual"}
              onClick={() =>
                setScaleMode((m) =>
                  m === "perceptual" ? "github" : "perceptual",
                )
              }
              sx={toggleButtonSx(scaleMode === "perceptual")}
            >
              Scale: {scaleMode === "perceptual" ? "Perceptual" : "GitHub"}
            </Box>
            <Box
              component="button"
              type="button"
              aria-pressed={showWeeklyBars}
              onClick={() => setShowWeeklyBars((v) => !v)}
              sx={toggleButtonSx(showWeeklyBars)}
            >
              Bars
            </Box>
            <Box
              component="button"
              type="button"
              aria-pressed={showHeroChip}
              onClick={() => setShowHeroChip((v) => !v)}
              sx={toggleButtonSx(showHeroChip)}
            >
              Hero chip
            </Box>

            <Box
              component="button"
              type="button"
              aria-label="Hide preview controls"
              onClick={() => setControlsOpen(false)}
              sx={{
                all: "unset",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 28,
                height: 28,
                ml: 0.25,
                borderRadius: "6px",
                color: "rgba(255, 255, 255, 0.65)",
                "@media (hover: hover)": {
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.08)",
                    color: "#fff",
                  },
                },
              }}
            >
              <CloseIcon sx={{ fontSize: "0.95rem" }} />
            </Box>
          </Box>
        ) : (
          <Box
            component="button"
            type="button"
            aria-label="Show preview controls"
            onClick={() => setControlsOpen(true)}
            sx={{
              all: "unset",
              cursor: "pointer",
              touchAction: "manipulation",
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              px: 1.5,
              minHeight: "44px",
              borderRadius: "999px",
              bgcolor: "#141414",
              border: "1px solid rgba(255, 255, 255, 0.16)",
              color: "rgba(255, 255, 255, 0.82)",
              fontFamily: MONO,
              fontSize: "0.74rem",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.45)",
              "@media (hover: hover)": {
                "&:hover": {
                  borderColor: accent,
                  color: accent,
                },
              },
              "&:focus-visible": {
                outline: `2px solid ${accent}`,
                outlineOffset: "2px",
              },
            }}
          >
            <TuneIcon sx={{ fontSize: "0.95rem" }} />
            preview
          </Box>
        )}
      </Box>
    </>
  );
};

export default GithubPreview;
