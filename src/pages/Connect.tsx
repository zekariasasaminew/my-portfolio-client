import ContactPageOutlinedIcon from "@mui/icons-material/ContactPageOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Button, Link, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { contact } from "../data/facts";
import { trackClick } from "../lib/analytics";

const RESUME_HREF = "/resume-2026.pdf";

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

const Connect = () => {
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const [photoFailed, setPhotoFailed] = useState(false);
  const accent = theme.palette.mode === "dark" ? "#7fd8a6" : "#0a8f4f";
  const source = searchParams.get("src");

  useEffect(() => {
    if (source) trackClick(`connect-src:${source}`);
  }, [source]);

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
    justifyContent: "flex-start",
    textTransform: "none",
    fontWeight: 600,
    fontSize: "1rem",
    py: 1.4,
    px: 2.5,
    borderRadius: "10px",
    borderColor: alpha(theme.palette.text.primary, 0.15),
    color: theme.palette.text.primary,
    "&:hover": {
      borderColor: accent,
      backgroundColor: alpha(accent, theme.palette.mode === "dark" ? 0.12 : 0.08),
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
        py: 6,
        position: "relative",
        zIndex: 1,
      }}
    >
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        sx={{ width: "100%", maxWidth: "400px", textAlign: "center" }}
      >
        {source && (
          <Typography
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            sx={{
              fontFamily: "monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: accent,
              fontWeight: 700,
              mb: 2.5,
            }}
          >
            ✓ tapped in
          </Typography>
        )}

        {!photoFailed && (
          <Box
            component="img"
            src="/images/headshot.jpg"
            alt="Zekarias Asaminew"
            onError={() => setPhotoFailed(true)}
            sx={{
              width: "120px",
              height: "120px",
              objectFit: "cover",
              borderRadius: "50%",
              border: `1px solid ${alpha(theme.palette.text.primary, 0.15)}`,
              mb: 2.5,
            }}
          />
        )}

        <Typography
          component="h1"
          variant="h4"
          sx={{ fontSize: "1.9rem", fontWeight: 700, letterSpacing: "-0.02em", mb: 0.75 }}
        >
          Zekarias Asaminew
        </Typography>

        <Typography sx={{ color: theme.palette.text.secondary, fontSize: "1rem", mb: 1 }}>
          Software Engineer at John Deere
        </Typography>

        <Typography
          sx={{
            color: theme.palette.text.secondary,
            fontSize: "0.92rem",
            lineHeight: 1.6,
            mb: 4,
          }}
        >
          Building agentic AI pipelines, dev tools, and campus products.
          Ranked #1 external contributor on GitHub Desktop v3.5.4.
        </Typography>

        <Stack spacing={1.25} sx={{ mb: 4 }}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<ContactPageOutlinedIcon />}
            onClick={handleSaveContact}
            sx={buttonSx}
          >
            Save my contact
          </Button>
          <Button
            variant="outlined"
            fullWidth
            component="a"
            href={RESUME_HREF}
            download="Zekarias-Asaminew-Resume.pdf"
            onClick={() => trackClick("connect-resume")}
            startIcon={<DescriptionOutlinedIcon />}
            sx={buttonSx}
          >
            Download resume
          </Button>
          <Button
            variant="outlined"
            fullWidth
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
            fullWidth
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
        </Stack>

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
    </Box>
  );
};

export default Connect;
