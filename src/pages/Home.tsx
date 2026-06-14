import { Box, Typography, Link, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import Navbar from "../components/Navbar";
import SpotifyNowPlaying from "../components/SpotifyNowPlaying";
// import { aboutSections } from "./About";

interface Props {
  toggleColorMode: () => void;
}

const Home = ({ toggleColorMode }: Props) => {
  const theme = useTheme();

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
        maxWidth: "650px",
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

      {/* Infinite Auto-scroll Image Navigation */}
      {/* <Box
        sx={{
          position: "relative",
          mb: 6,
          mt: 2,
          height: "150px",
          overflow: "hidden",
          "&::before, &::after": {
            content: '""',
            position: "absolute",
            top: 0,
            width: "50px",
            height: "100%",
            zIndex: 2,
          },
          "&::before": {
            left: 0,
            background: `linear-gradient(to right, ${theme.palette.background.default}, transparent)`,
          },
          "&::after": {
            right: 0,
            background: `linear-gradient(to left, ${theme.palette.background.default}, transparent)`,
          },
        }}
      > */}
      {/* <motion.div
          style={{
            display: "flex",
            gap: "1rem",
            width: "fit-content",
          }}
          animate={{
            x: [`0%`, `-50%`],
          }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          }}
          whileHover={{ animationPlayState: "paused" }}
        > */}
      {/* Triple the items for smoother loop */}
      {/* {[
            ...Object.entries(aboutSections),
            ...Object.entries(aboutSections),
          ].map(([id, section], index) => (
            <Link
              key={`${id}-${index}`}
              href={`/about#${id}`}
              sx={{
                textDecoration: "none",
                color: "inherit",
                width: "150px",
                flexShrink: 0,
              }}
            >
              <Box
                component="img"
                src={section.image}
                alt={section.title}
                sx={{
                  width: "150px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              />
            </Link>
          ))}
        </motion.div> */}
      {/* </Box> */}

      {/* Main Content */}
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="h4"
          sx={{
            mb: 3,
            lineHeight: 1.8,
          }}
        >
          Hi, I'm Zekarias Asaminew
        </Typography>

        <Typography
          variant="body1"
          component="div"
          sx={{ mb: 3, fontWeight: 300, lineHeight: 1.8, fontSize: "1rem" }}
        >
          I'm a software engineer who likes building things people actually use.
          For the past two-plus years as a Student Software Engineer at{" "}
          <Link href="https://www.deere.com" target="_blank" sx={LinkStyle}>
            John Deere
          </Link>
          , I've shipped enterprise applications that support thousands of
          employees across more than ten factories, the kind of work where a bug
          isn't an abstraction, it's someone on a factory floor waiting on a
          tool. I'm finishing a self-designed CS and Bioinformatics major at{" "}
          <Link href="https://www.augustana.edu" target="_blank" sx={LinkStyle}>
            Augustana College
          </Link>
          , the first contract major of its kind there, and this summer I'm
          joining{" "}
          <Link href="https://www.ey.com" target="_blank" sx={LinkStyle}>
            EY
          </Link>
          's Tax Technology &amp; Transformation team in Chicago to work at the
          intersection of software and large-scale business systems.
        </Typography>

        <Typography
          variant="body1"
          component="div"
          sx={{ mb: 3, fontWeight: 300, lineHeight: 1.8, fontSize: "1rem" }}
        >
          Outside of work, I build in the open. I'm the top external contributor
          to{" "}
          <Link
            href="https://github.com/desktop/desktop"
            target="_blank"
            sx={LinkStyle}
          >
            GitHub Desktop
          </Link>
          , I've landed a fix in the{" "}
          <Link
            href="https://github.com/facebook/react"
            target="_blank"
            sx={LinkStyle}
          >
            React Compiler
          </Link>
          , and I've shipped tools like{" "}
          <Link
            href="https://github.com/zekariasasaminew/jetbrains-acp"
            target="_blank"
            sx={LinkStyle}
          >
            jetbrains-acp
          </Link>{" "}
          (an open-source ACP client for JetBrains IDEs) and{" "}
          <Link
            href="https://github.com/zekariasasaminew/instruct-sync"
            target="_blank"
            sx={LinkStyle}
          >
            instruct-sync
          </Link>
          . I care deeply about developer experience and agentic tooling. I
          introduced GitHub Copilot CLI as my team's primary development
          platform at Deere and ran a workshop on it at my college's first-ever
          hackathon.
        </Typography>

        <Typography
          variant="body1"
          component="div"
          sx={{ mb: 3, fontWeight: 300, lineHeight: 1.8, fontSize: "1rem" }}
        >
          I also like turning everyday observations into products.{" "}
          <Link
            href="https://github.com/zekariasasaminew/campus-ai"
            target="_blank"
            sx={LinkStyle}
          >
            CampusEx
          </Link>{" "}
          started when I noticed students tossing out perfectly good furniture at
          move-out; it's now a campus marketplace with 500+ users. For my senior
          research I'm building an EEG-based brain-computer interface, and I've
          collected a few wins along the way, including Best Insight at ASA
          DataFest and induction into the al-Khwarizmi Computer Science Honor
          Society.
        </Typography>

        <Typography
          variant="body1"
          sx={{ mb: 5, fontWeight: 300, lineHeight: 1.8, fontSize: "1rem" }}
        >
          When I'm not coding, I'm playing soccer, overthinking my Fantasy
          Premier League lineup, or taking photos. I'm drawn to problems where
          software, AI, and real-world systems meet, and I'm looking for a team
          where I can keep building things that matter.
        </Typography>

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
