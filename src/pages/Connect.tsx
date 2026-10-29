import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { keyframes } from "@emotion/react";
import { Box, Button, Link, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { contact, walletPass } from "../data/facts";
import { trackClick } from "../lib/analytics";

const RESUME_HREF = "/resume-2026.pdf";
const LINKEDIN_BLUE = "#0A66C2";

const EVENT_LABELS: Record<string, string> = {
  shpe2026: "SHPE 2026",
};

const STATS = [
  { value: "$3.7M+", label: "saved at John Deere" },
  { value: "720+", label: "CampusEx users" },
  { value: "Top", label: "GitHub Desktop contributor" },
];

const TALKING_POINTS = [
  "John Deere agent that traces prod alerts to the bad commit and opens a fix PR",
  "pact: Rust tool that runs coding agents in parallel",
  "CampusEx: 720+ users in 3 weeks",
  "Top external contributor to GitHub Desktop",
];

const sheen = keyframes`
  0%, 55% { transform: translateX(-120%) skewX(-18deg); }
  100% { transform: translateX(220%) skewX(-18deg); }
`;

const LinkedInLogo = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
    <rect x="2" y="2" width="20" height="20" rx="2" fill="#fff" />
    <path
      fill={LINKEDIN_BLUE}
      d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
    />
  </svg>
);

const GitHubLogo = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden>
    <path
      fill={color}
      d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
    />
  </svg>
);

const useLockPageScroll = () => {
  useEffect(() => {
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = previous;
    };
  }, []);
};

const CardFace = ({ back, children }: { back?: boolean; children: ReactNode }) => (
  <Box
    sx={{
      position: "absolute",
      inset: 0,
      borderRadius: "6cqw",
      padding: "1.6cqw",
      backfaceVisibility: "hidden",
      WebkitBackfaceVisibility: "hidden",
      transform: back ? "rotateY(180deg)" : undefined,
      background:
        "conic-gradient(from 210deg, #ffd36e, #ff7eb3, #7a8cff, #5ee7df, #b6ff8a, #ffd36e)",
      boxShadow: "0 30px 60px -20px rgba(0,0,0,0.6)",
    }}
  >
    <Box
      sx={{
        position: "relative",
        height: "100%",
        borderRadius: "4.6cqw",
        overflow: "hidden",
        background: "linear-gradient(160deg, #1d1f2b 0%, #12131a 55%, #0d0e13 100%)",
        color: "#f4f4f6",
        display: "flex",
        flexDirection: "column",
        padding: "6cqw",
        textAlign: "left",
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          width: "40%",
          pointerEvents: "none",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
          animation: `${sheen} 5s ease-in-out infinite`,
          "@media (prefers-reduced-motion: reduce)": { animation: "none", opacity: 0 },
        },
      }}
    >
      {children}
    </Box>
  </Box>
);

const isAndroid = () => /android/i.test(navigator.userAgent);

const WalletBadge = () => {
  const android = isAndroid();
  return (
    <Box
      component="a"
      href={android ? walletPass.google : walletPass.apple}
      target={android ? "_blank" : undefined}
      rel={android ? "noopener" : undefined}
      onClick={() => trackClick(android ? "connect-google-wallet" : "connect-apple-wallet")}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 48 }}
    >
      <Box
        component="img"
        src={android ? "/images/wallet/add-to-google-wallet.svg" : "/images/wallet/add-to-apple-wallet.svg"}
        alt={android ? "Add to Google Wallet" : "Add to Apple Wallet"}
        sx={{ height: 44, width: "auto", maxWidth: "100%", display: "block" }}
      />
    </Box>
  );
};

const Connect = () => {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const [searchParams] = useSearchParams();
  const [photoFailed, setPhotoFailed] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const accent = theme.palette.mode === "dark" ? "#7fd8a6" : "#0a8f4f";
  const source = searchParams.get("src");
  const eventLabel = source ? EVENT_LABELS[source] : undefined;

  useLockPageScroll();

  useEffect(() => {
    if (source) trackClick(`connect-src:${source}`);
  }, [source]);

  const handleFlip = () => {
    setFlipped((value) => {
      if (!value) trackClick("connect-card-flip");
      return !value;
    });
  };

  const tileSx = {
    minWidth: 0,
    textTransform: "none",
    fontWeight: 600,
    fontSize: "0.95rem",
    borderRadius: "14px",
    borderColor: alpha(theme.palette.text.primary, 0.15),
    color: theme.palette.text.primary,
    backgroundColor: alpha(theme.palette.background.default, 0.7),
    backdropFilter: "blur(6px)",
    "&:hover": {
      borderColor: accent,
      backgroundColor: alpha(accent, theme.palette.mode === "dark" ? 0.12 : 0.08),
    },
  };

  const eyebrowSx = {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    fontWeight: 700,
  } as const;

  return (
    <Box
      sx={{
        height: "100dvh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "clamp(10px, 2.2dvh, 22px)",
        px: 2,
        py: "clamp(10px, 2.5dvh, 28px)",
        boxSizing: "border-box",
        position: "relative",
        zIndex: 1,
      }}
    >
      <Typography
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        sx={{ ...eyebrowSx, fontSize: "0.72rem", color: accent }}
      >
        {eventLabel ? `✓ ${eventLabel} · tapped in` : source ? "✓ tapped in" : "Zekarias Asaminew"}
      </Typography>

      <Box
        sx={{
          width: "min(360px, 90vw, calc((100dvh - 270px) * 0.75))",
          aspectRatio: "3 / 4",
          perspective: "1200px",
          containerType: "inline-size",
          flexShrink: 0,
        }}
      >
        <motion.div
          initial={reduceMotion ? false : { rotateY: -200, y: 40, opacity: 0, scale: 0.85 }}
          animate={{ rotateY: 0, y: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 70, damping: 14, mass: 1 }}
          style={{ width: "100%", height: "100%", transformStyle: "preserve-3d" }}
        >
          <Box
            component="button"
            type="button"
            onClick={handleFlip}
            aria-pressed={flipped}
            aria-label={flipped ? "Flip card to the front" : "Flip card to see what to ask me about"}
            sx={{
              all: "unset",
              boxSizing: "border-box",
              display: "block",
              width: "100%",
              height: "100%",
              cursor: "pointer",
              WebkitTapHighlightColor: "transparent",
              transformStyle: "preserve-3d",
              "&:focus-visible": { outline: `2px solid ${accent}`, outlineOffset: "4px", borderRadius: "6cqw" },
            }}
          >
            <motion.div
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 16 }}
              style={{ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d" }}
            >
              <CardFace>
                <Box
                  sx={{
                    flex: "1 1 auto",
                    minHeight: 0,
                    borderRadius: "3.5cqw",
                    overflow: "hidden",
                    background: "linear-gradient(135deg, #2a3350, #3b2440)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  {!photoFailed && (
                    <Box
                      component="img"
                      src="/images/headshot.jpg"
                      alt="Zekarias Asaminew"
                      draggable={false}
                      onError={() => setPhotoFailed(true)}
                      sx={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 25%" }}
                    />
                  )}
                </Box>

                <Typography
                  component="h1"
                  sx={{ mt: "4cqw", fontSize: "9.6cqw", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1 }}
                >
                  Zekarias Asaminew
                </Typography>
                <Typography sx={{ mt: "1cqw", fontSize: "max(15px, 5.4cqw)", color: "rgba(244,244,246,0.75)" }}>
                  Software Engineer · John Deere
                </Typography>

                <Box
                  sx={{
                    mt: "4cqw",
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    borderTop: "1px solid rgba(255,255,255,0.12)",
                    pt: "3.5cqw",
                  }}
                >
                  {STATS.map((stat) => (
                    <Box key={stat.label} sx={{ textAlign: "center", px: "1cqw" }}>
                      <Typography sx={{ fontSize: "8cqw", fontWeight: 700, color: "#7fd8a6", lineHeight: 1.1 }}>
                        {stat.value}
                      </Typography>
                      <Typography
                        sx={{ mt: "1cqw", fontSize: "max(12px, 3.9cqw)", lineHeight: 1.25, color: "rgba(244,244,246,0.7)" }}
                      >
                        {stat.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Typography
                  sx={{ ...eyebrowSx, mt: "3.5cqw", fontSize: "max(11px, 3.4cqw)", textAlign: "center", opacity: 0.6 }}
                >
                  tap card to flip ↻
                </Typography>
              </CardFace>

              <CardFace back>
                <Typography sx={{ ...eyebrowSx, fontSize: "4.6cqw", color: "#ffd36e" }}>Ask me about</Typography>

                <Box
                  component="ol"
                  sx={{
                    m: 0,
                    mt: "5cqw",
                    p: 0,
                    listStyle: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4.5cqw",
                    flex: "1 1 auto",
                  }}
                >
                  {TALKING_POINTS.map((point, index) => (
                    <Box component="li" key={point} sx={{ display: "flex", gap: "3cqw" }}>
                      <Typography sx={{ ...eyebrowSx, fontSize: "4.4cqw", color: "#7fd8a6", pt: "0.9cqw" }}>
                        0{index + 1}
                      </Typography>
                      <Typography sx={{ fontSize: "5.6cqw", lineHeight: 1.35 }}>{point}</Typography>
                    </Box>
                  ))}
                </Box>

                <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.12)", pt: "3.5cqw" }}>
                  <Typography sx={{ fontSize: "4.4cqw", color: "rgba(244,244,246,0.75)" }}>
                    Augustana College · CS & Bioinformatics
                  </Typography>
                  <Typography sx={{ mt: "1cqw", fontSize: "4.4cqw", color: "#7fd8a6", fontWeight: 600 }}>
                    Open to full-time SWE roles
                  </Typography>
                </Box>
              </CardFace>
            </motion.div>
          </Box>
        </motion.div>
      </Box>

      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5, ease: "easeOut" }}
        sx={{
          width: "min(360px, 100%)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1,
        }}
      >
        <Button
          variant="outlined"
          component="a"
          href={contact.linkedin}
          target="_blank"
          rel="noopener"
          aria-label="LinkedIn"
          onClick={() => trackClick("connect-linkedin")}
          sx={{ ...tileSx, height: 64 }}
        >
          <LinkedInLogo size={38} />
        </Button>
        <Button
          variant="outlined"
          component="a"
          href={contact.github}
          target="_blank"
          rel="noopener"
          aria-label="GitHub"
          onClick={() => trackClick("connect-github")}
          sx={{ ...tileSx, height: 64 }}
        >
          <GitHubLogo size={36} color={theme.palette.text.primary} />
        </Button>
        <WalletBadge />
        <Button
          variant="outlined"
          component="a"
          href={RESUME_HREF}
          target="_blank"
          rel="noopener"
          onClick={() => trackClick("connect-resume")}
          startIcon={<DescriptionOutlinedIcon />}
          sx={{ ...tileSx, height: 48 }}
        >
          Resume
        </Button>
      </Box>

      <Link
        href="/"
        onClick={() => trackClick("connect-full-portfolio")}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.5,
          color: theme.palette.text.secondary,
          fontSize: "0.85rem",
          textDecoration: "none",
          "&:hover": { color: accent },
        }}
      >
        See full portfolio <ArrowForwardIcon sx={{ fontSize: "0.9rem" }} />
      </Link>
    </Box>
  );
};

export default Connect;
