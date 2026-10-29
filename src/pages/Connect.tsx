import ContactPageOutlinedIcon from "@mui/icons-material/ContactPageOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Button, Link, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { contact } from "../data/facts";
import { trackClick } from "../lib/analytics";

const RESUME_HREF = "/resume-2026.pdf";
const MAX_TILT_DEG = 14;
const TAP_SLOP_PX = 8;

const EVENT_LABELS: Record<string, string> = {
  shpe2026: "SHPE 2026",
};

const STATS = [
  { value: "$3.7M+", label: "saved at John Deere" },
  { value: "720+", label: "CampusEx users" },
  { value: "Top", label: "GitHub Desktop contributor" },
];

const TALKING_POINTS = [
  "An agent at John Deere that traces production alerts to the commit that caused them and opens a draft fix PR",
  "pact: a Rust tool that runs multiple coding agents in parallel",
  "CampusEx: 720+ users in 3 weeks, all word of mouth",
  "Top external contributor in GitHub Desktop v3.5.4",
];

const buildVCard = () =>
  [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "N:Asaminew;Zekarias;;;",
    "FN:Zekarias Asaminew",
    "ORG:John Deere",
    "TITLE:Software Engineer",
    `EMAIL;TYPE=INTERNET:${contact.email}`,
    `URL:${contact.website}`,
    `URL:${contact.linkedin}`,
    `URL:${contact.github}`,
    "END:VCARD",
  ].join("\r\n");

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
      }}
    >
      {children}
    </Box>
  </Box>
);

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

  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const springConfig = { stiffness: 180, damping: 18 };
  const tiltX = useSpring(useTransform(pointerY, [0, 1], [MAX_TILT_DEG, -MAX_TILT_DEG]), springConfig);
  const tiltY = useSpring(useTransform(pointerX, [0, 1], [-MAX_TILT_DEG, MAX_TILT_DEG]), springConfig);
  const glareX = useTransform(pointerX, [0, 1], [0, 100]);
  const glareY = useTransform(pointerY, [0, 1], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.35), rgba(255,255,255,0) 55%)`;
  const foilShift = useMotionTemplate`${glareX}% ${glareY}%`;

  const pressStart = useRef<{ x: number; y: number } | null>(null);
  const movedSincePress = useRef(false);

  const updateTilt = (event: PointerEvent<HTMLElement>) => {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)));
    pointerY.set(Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height)));
  };

  const resetTilt = () => {
    pointerX.set(0.5);
    pointerY.set(0.5);
  };

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    pressStart.current = { x: event.clientX, y: event.clientY };
    movedSincePress.current = false;
    updateTilt(event);
  };

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const start = pressStart.current;
    if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > TAP_SLOP_PX) {
      movedSincePress.current = true;
    }
    if (event.pointerType === "mouse" || start) updateTilt(event);
  };

  const handlePointerUp = (event: PointerEvent<HTMLElement>) => {
    pressStart.current = null;
    if (event.pointerType !== "mouse") resetTilt();
  };

  const handleFlip = () => {
    if (movedSincePress.current) return;
    setFlipped((value) => {
      if (!value) trackClick("connect-card-flip");
      return !value;
    });
  };

  const handleSaveContact = () => {
    trackClick("connect-save-contact");
    const blob = new Blob([buildVCard()], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Zekarias-Asaminew.vcf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const buttonSx = {
    justifyContent: "center",
    textTransform: "none",
    fontWeight: 600,
    fontSize: "0.92rem",
    py: 1.1,
    px: 1.5,
    borderRadius: "10px",
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
          width: "min(320px, 82vw, calc((100dvh - 230px) * 0.7))",
          aspectRatio: "5 / 7",
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
          <motion.div
            role="button"
            tabIndex={0}
            aria-pressed={flipped}
            aria-label={flipped ? "Flip card to the front" : "Flip card to see what to ask me about"}
            onClick={handleFlip}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                movedSincePress.current = false;
                handleFlip();
              }
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerLeave={resetTilt}
            style={{
              width: "100%",
              height: "100%",
              rotateX: tiltX,
              rotateY: tiltY,
              transformStyle: "preserve-3d",
              cursor: "pointer",
              touchAction: "none",
              userSelect: "none",
              outline: "none",
            }}
          >
            <motion.div
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 16 }}
              style={{ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d" }}
            >
              <CardFace>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <Typography sx={{ ...eyebrowSx, fontSize: "3.4cqw", color: "#ffd36e" }}>
                    ★ {eventLabel ?? "First"} edition
                  </Typography>
                  <Typography sx={{ ...eyebrowSx, fontSize: "3.4cqw", opacity: 0.55 }}>#001</Typography>
                </Box>

                <Box
                  sx={{
                    mt: "4cqw",
                    flex: "1 1 auto",
                    minHeight: 0,
                    borderRadius: "3.5cqw",
                    overflow: "hidden",
                    position: "relative",
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
                  sx={{ mt: "4cqw", fontSize: "7.6cqw", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1 }}
                >
                  Zekarias Asaminew
                </Typography>
                <Typography sx={{ mt: "1cqw", fontSize: "max(12px, 4.1cqw)", color: "rgba(244,244,246,0.68)" }}>
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
                      <Typography sx={{ fontSize: "5.6cqw", fontWeight: 700, color: "#7fd8a6", lineHeight: 1.1 }}>
                        {stat.value}
                      </Typography>
                      <Typography sx={{ mt: "1cqw", fontSize: "max(10px, 2.9cqw)", lineHeight: 1.25, color: "rgba(244,244,246,0.6)" }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Typography
                  sx={{ ...eyebrowSx, mt: "3.5cqw", fontSize: "max(9px, 2.8cqw)", textAlign: "center", opacity: 0.45 }}
                >
                  tap to flip · drag to tilt
                </Typography>
              </CardFace>

              <CardFace back>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <Typography sx={{ ...eyebrowSx, fontSize: "3.4cqw", color: "#ffd36e" }}>Ask me about</Typography>
                  <Typography sx={{ ...eyebrowSx, fontSize: "3.4cqw", opacity: 0.55 }}>#001</Typography>
                </Box>

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
                      <Typography sx={{ ...eyebrowSx, fontSize: "3.6cqw", color: "#7fd8a6", pt: "0.6cqw" }}>
                        0{index + 1}
                      </Typography>
                      <Typography sx={{ fontSize: "4.3cqw", lineHeight: 1.4 }}>{point}</Typography>
                    </Box>
                  ))}
                </Box>

                <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.12)", pt: "3.5cqw" }}>
                  <Typography sx={{ fontSize: "3.6cqw", color: "rgba(244,244,246,0.7)" }}>
                    Augustana College · CS & Bioinformatics
                  </Typography>
                  <Typography sx={{ mt: "1cqw", fontSize: "3.6cqw", color: "#7fd8a6", fontWeight: 600 }}>
                    Open to full-time software engineering roles
                  </Typography>
                </Box>
              </CardFace>
            </motion.div>

            <motion.div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "6cqw",
                pointerEvents: "none",
                background: glare,
                mixBlendMode: "overlay",
                transform: "translateZ(1px)",
              }}
            />
            <motion.div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "6cqw",
                pointerEvents: "none",
                opacity: 0.18,
                mixBlendMode: "color-dodge",
                backgroundImage:
                  "repeating-linear-gradient(115deg, #ff7eb3 0%, #7a8cff 8%, #5ee7df 16%, #b6ff8a 24%, #ffd36e 32%, #ff7eb3 40%)",
                backgroundSize: "300% 300%",
                backgroundPosition: foilShift,
                transform: "translateZ(1px)",
              }}
            />
          </motion.div>
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
        <Button variant="outlined" startIcon={<ContactPageOutlinedIcon />} onClick={handleSaveContact} sx={buttonSx}>
          Save contact
        </Button>
        <Button
          variant="outlined"
          component="a"
          href={RESUME_HREF}
          download="Zekarias-Asaminew-Resume.pdf"
          onClick={() => trackClick("connect-resume")}
          startIcon={<DescriptionOutlinedIcon />}
          sx={buttonSx}
        >
          Resume
        </Button>
        <Button
          variant="outlined"
          component="a"
          href={contact.linkedin}
          target="_blank"
          rel="noopener"
          onClick={() => trackClick("connect-linkedin")}
          startIcon={<LinkedInIcon />}
          sx={buttonSx}
        >
          LinkedIn
        </Button>
        <Button
          variant="outlined"
          component="a"
          href={contact.github}
          target="_blank"
          rel="noopener"
          onClick={() => trackClick("connect-github")}
          startIcon={<GitHubIcon />}
          sx={buttonSx}
        >
          GitHub
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
