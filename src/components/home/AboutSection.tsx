import { useState } from "react";
import { Box, Typography, Link, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";

const currentlyUsing = [
  "LangChain",
  "LangGraph",
  "OpenAI API",
  "Next.js",
  "TypeScript",
  "PostgreSQL",
];

const AboutSection = () => {
  const theme = useTheme();
  const [photoFailed, setPhotoFailed] = useState(false);
  const accent = theme.palette.mode === "dark" ? "#7fd8a6" : "#0a8f4f";

  const linkSx = {
    color: accent,
    fontWeight: 600,
    textDecoration: "none",
    "&:hover": { textDecoration: "underline" },
  };

  return (
    <Box component="section" id="about" sx={{ scrollMarginTop: "5rem", mb: { xs: 8, md: 10 } }}>
      <Typography component="h2" variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        about me
      </Typography>

      <Box sx={{ display: "flex", gap: 5, alignItems: "flex-start", flexDirection: { xs: "column", md: "row" } }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body1" sx={{ lineHeight: 1.75, mb: 3, color: theme.palette.text.secondary, fontSize: "1.05rem" }}>
            I'm a part-time{" "}
            <Box component="span" sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
              Software Engineer
            </Box>{" "}
            at{" "}
            <Link href="https://www.deere.com" target="_blank" rel="noopener" sx={linkSx}>
              John Deere
            </Link>
            , where I build agentic pipelines and ship features across enterprise apps. Most recently, I
            was an{" "}
            <Box component="span" sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
              AI Engineer Intern
            </Box>{" "}
            at{" "}
            <Link href="https://www.ey.com" target="_blank" rel="noopener" sx={linkSx}>
              EY
            </Link>
            , building agents and automation inside a Big Four tax practice.
          </Typography>

          <Typography
            variant="caption"
            sx={{
              display: "block",
              fontFamily: "monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: accent,
              mb: 1.25,
              fontWeight: 700,
            }}
          >
            Technologies I'm currently using
          </Typography>
          <Box
            component="ul"
            sx={{
              listStyle: "none",
              p: 0,
              m: 0,
              mb: 3,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 0.75,
              fontFamily: "monospace",
              fontSize: "0.85rem",
              color: theme.palette.text.secondary,
            }}
          >
            {currentlyUsing.map((item) => (
              <Box component="li" key={item} sx={{ "&::before": { content: '"▹ "', color: accent } }}>
                {item}
              </Box>
            ))}
          </Box>

          <Typography variant="body1" sx={{ lineHeight: 1.75, color: theme.palette.text.secondary, fontSize: "1.05rem" }}>
            Outside of engineering, I'm Tech Lead at{" "}
            <Box component="span" sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
              Google Developer Group
            </Box>{" "}
            and VP of the{" "}
            <Box component="span" sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
              Data Analytics Club
            </Box>{" "}
            at Augustana, where our team won Best Insight Award at ASA DataFest 2026.
          </Typography>
        </Box>

        {!photoFailed && (
          <Box
            component="img"
            src="/images/headshot.jpg"
            alt="Zekarias Asaminew"
            onError={() => setPhotoFailed(true)}
            sx={{
              width: { xs: "100%", md: "260px" },
              height: { xs: "auto", md: "260px" },
              objectFit: "cover",
              borderRadius: "10px",
              border: `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,
              flexShrink: 0,
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default AboutSection;
