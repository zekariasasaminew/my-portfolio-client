import { useState } from "react";
import {
  Box,
  Typography,
  Link,
  useTheme,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import Navbar from "../components/Navbar";
import ChatTerminal from "../components/ChatTerminal";
import SpotifyNowPlaying from "../components/SpotifyNowPlaying";
import { impactStats, contact, resumeFiles } from "../data/facts";

interface Props {
  toggleColorMode: () => void;
}

const Home = ({ toggleColorMode }: Props) => {
  const theme = useTheme();
  const [resumeAnchor, setResumeAnchor] = useState<null | HTMLElement>(null);

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

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      sx={{
        minHeight: "100vh",
        maxWidth: "700px",
        margin: "0 auto",
        padding: { xs: "2rem", md: "4rem" },
        display: "flex",
        flexDirection: "column",
        color: theme.palette.text.primary,
        position: "relative",
        zIndex: 1,
      }}
    >
      <Navbar toggleColorMode={toggleColorMode} />

      <Box sx={{ flex: 1 }}>
        <Typography
          sx={{
            fontFamily: "monospace",
            fontSize: "0.78rem",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: theme.palette.mode === "dark" ? "#7fd8a6" : "#0a8f4f",
            mb: 1,
          }}
        >
          Software Engineer · Agentic AI
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: "2rem", md: "2.6rem" },
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            mb: 2,
          }}
        >
          Zekarias Asaminew
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
          }}
        >
          Currently building agents at{" "}
          <Link href="https://www.ey.com" target="_blank" sx={LinkStyle}>
            EY
          </Link>
          . Previously{" "}
          <Link href="https://www.deere.com" target="_blank" sx={LinkStyle}>
            John Deere
          </Link>
          , where he shipped a pipeline that traces production alerts back to
          the responsible git commit and opens the fix as a draft PR. Ask the
          terminal below. It knows the rest.
        </Typography>

        <Box sx={{ mb: 3 }}>
          <ChatTerminal />
        </Box>

        {/* Impact strip */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
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
        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
          <Link
            href="https://github.com/zekariasasaminew"
            target="_blank"
            rel="noopener"
            sx={{
              ...LinkStyle,
              display: "flex",
              alignItems: "center",
            }}
          >
            <GitHubIcon />
          </Link>
          <Link
            href="https://linkedin.com/in/zekarias-asaminew"
            target="_blank"
            rel="noopener"
            sx={{
              ...LinkStyle,
              display: "flex",
              alignItems: "center",
            }}
          >
            <LinkedInIcon />
          </Link>
          <Link
            href={`mailto:${contact.email}`}
            sx={{
              ...LinkStyle,
              display: "flex",
              alignItems: "center",
            }}
          >
            <EmailOutlinedIcon />
          </Link>
          <IconButton
            onClick={(e) => setResumeAnchor(e.currentTarget)}
            aria-label="Download resume"
            sx={{
              p: 0,
              color: "inherit",
              opacity: 0.85,
              "&:hover": { opacity: 1, backgroundColor: "transparent" },
            }}
          >
            <DescriptionOutlinedIcon />
          </IconButton>
          <Menu
            anchorEl={resumeAnchor}
            open={Boolean(resumeAnchor)}
            onClose={() => setResumeAnchor(null)}
          >
            <MenuItem
              component="a"
              href={resumeFiles.ai.href}
              download
              onClick={() => setResumeAnchor(null)}
            >
              Resume ({resumeFiles.ai.label})
            </MenuItem>
            <MenuItem
              component="a"
              href={resumeFiles.coreSwe.href}
              download
              onClick={() => setResumeAnchor(null)}
            >
              Resume ({resumeFiles.coreSwe.label})
            </MenuItem>
          </Menu>
        </Box>

        {/* Spotify Now Playing */}
        <Box sx={{ mt: 2 }}>
          <SpotifyNowPlaying />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
