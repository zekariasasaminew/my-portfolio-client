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
          variant="h3"
          sx={{
            mb: 3,
            lineHeight: 1.8,
            // fontSize: "1rem",
          }}
        >
          Hey, I'm Zekarias Asaminew!
        </Typography>

        <Typography
          variant="body1"
          component="div"
          sx={{
            mb: 3,
            fontWeight: 300,
            lineHeight: 1.8,
            fontSize: "1rem",
          }}
        >
          I'm a software engineer at{" "}
          <Link href="https://www.deere.com" target="_blank" sx={LinkStyle}>
            John Deere
          </Link>
          , where I work on innovative tech solutions. I try my best to not
          force push to main. I am a Junior at{" "}
          <Link href="https://www.augustana.edu" target="_blank" sx={LinkStyle}>
            Augustana College
          </Link>
          . On the side, I like doing a little chemical mixing (no Walter White
          stuff; just the legally sanctioned, lab-approved kind).
        </Typography>

        <Typography
          variant="body1"
          fontWeight="300"
          component="div"
          sx={{
            mb: 3,
            lineHeight: 1.8,
            fontSize: "1rem",
          }}
        >
          I love creating tools that make life easier and a little more clever.
          Check out my{" "}
          <Link href="/experience" sx={LinkStyle}>
            experience
          </Link>{" "}
          to see my work, or browse through my{" "}
          <Link href="/notes" sx={LinkStyle}>
            notes
          </Link>{" "}
          where I rant a bit about technology and development.
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mb: 5,
            lineHeight: 1.8,
            fontSize: "1rem",
            fontWeight: 300,
          }}
        >
          Feel free to explore my work or get in touch!
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
