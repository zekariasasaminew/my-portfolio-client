import { Box, Typography, Divider, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

interface EYInternshipProps {
  toggleColorMode: () => void;
}

const engagements: string[] = [
  "Wrote a JavaScript automation for a certificate-processing workflow. It carried a real chunk of the 70,000+ certificates processed during a 4-day cutover",
  "Designed a product-taxonomy classification agent in EY's internal agent studio, then wrote the architecture doc for a custom agent when it hit a ceiling",
  "Used AI tools to speed through reconciling client spreadsheets against internal analyses on an indirect-tax project",
  "Contributed system-design documentation for a multi-country e-invoicing rollout on SAP S/4HANA: process-flow diagrams, country-specific logic",
  "Merged and translated a 50-state Vertex taxability matrix into structured, plain-English taxability logic",
];

const reflectionParagraphs: string[] = [
  "If I'm honest, the most useful thing I brought to any of these projects wasn't a script or a shortcut. It was asking a good question early, before touching anything. I walked in underestimating how much depth tax actually has, and by the end of the summer I'd gotten a lot better at pausing before I automated something, because the fastest way to build the wrong tool is to skip the part where you ask what the work is even for.",
  "Getting trusted with real client work, even small slices of it, changed how I read requirements and how carefully I reviewed my own output before sending anything along. There's an actual client on the other end of what you're doing, and that changes ownership completely. I caught myself double-checking things I probably would have glossed over in a school project.",
  "Every real win I had with AI started the same way: I noticed a manual pattern first, and only then went looking for the right tool, whether that ended up being a script, an agent, or honestly just a better Excel formula. AI never did the thinking part for me. What it did was handle the repeating, but only after I'd already figured out what was worth repeating.",
  "Explaining my logic to a reviewer, walking someone through a design doc, even just writing a clear Teams message, mattered just as much as the work behind it. I got better at saying what I meant the first time around, mostly because I learned the alternative was always a longer, more annoying conversation later.",
];

const EYInternship = ({ toggleColorMode }: EYInternshipProps) => {
  const theme = useTheme();
  const accent = theme.palette.mode === "dark" ? "#E8B93B" : "#9B7F1F";

  const proseSx = {
    maxWidth: "70ch",
    lineHeight: 1.8,
    color: theme.palette.text.primary,
    opacity: 0.92,
  };

  const sectionDivider = (
    <Divider
      sx={{
        my: { xs: 5, md: 7 },
        borderColor: accent,
        opacity: 0.25,
        maxWidth: "120px",
      }}
    />
  );

  const photo = ({
    src,
    alt,
    caption,
    orientation = "landscape",
  }: {
    src: string;
    alt: string;
    caption: string;
    orientation?: "portrait" | "landscape";
  }) => (
    <Box
      component="figure"
      sx={{ m: 0, my: 4, display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Box
        component="img"
        src={src}
        alt={alt}
        loading="lazy"
        sx={{
          width: "100%",
          maxWidth: orientation === "portrait" ? "320px" : "560px",
          borderRadius: "10px",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 8px 24px rgba(0,0,0,0.4)"
              : "0 8px 24px rgba(0,0,0,0.12)",
          objectFit: "cover",
        }}
      />
      <Typography
        component="figcaption"
        variant="body2"
        sx={{
          mt: 1.5,
          color: theme.palette.text.secondary,
          fontStyle: "italic",
          textAlign: "center",
          maxWidth: "50ch",
        }}
      >
        {caption}
      </Typography>
    </Box>
  );

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      sx={{
        minHeight: "100vh",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: { xs: "2rem", md: "4rem" },
        color: theme.palette.text.primary,
        position: "relative",
        zIndex: 1,
      }}
    >
      <Navbar toggleColorMode={toggleColorMode} />

      <Box sx={{ maxWidth: "800px", mx: "auto" }}>
      {/* Hero */}
      <Box component="section" sx={{ mb: { xs: 5, md: 7 } }}>
        <Typography
          sx={{
            fontFamily: "monospace",
            fontSize: "0.78rem",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: accent,
            mb: 1.5,
          }}
        >
          Tax Technology &amp; Transformation · Chicago · Summer
        </Typography>
        <Typography
          component="h1"
          variant="h4"
          sx={{
            fontSize: { xs: "2rem", md: "2.6rem" },
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
            mb: 3,
          }}
        >
          Eight Weeks at EY
        </Typography>
        <Typography component="div" variant="body1" sx={proseSx}>
          Spent eight weeks in Chicago this summer on EY's Tax Technology and
          Transformation team, indirect tax side. Went in wondering if there
          was any real overlap between software and tax work. Turned out
          there was: a cutover I automated with a script, a taxability matrix
          with way more nuance than a spreadsheet lets on, and an AI agent
          built from scratch.
        </Typography>

        {photo({
          src: "/images/ey/training-week-dinner.jpg",
          alt: "A group of interns at a dinner table during first week training, before the internship officially began.",
          caption:
            "Some of us during first week training, before the internship had even officially started.",
          orientation: "landscape",
        })}
      </Box>

      {sectionDivider}

      {/* What I actually worked on */}
      <Box component="section" sx={{ mb: { xs: 5, md: 7 } }}>
        <Typography component="h2" variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          What I Actually Worked On
        </Typography>
        <Typography
          component="p"
          variant="body1"
          sx={{ ...proseSx, mb: 3, color: theme.palette.text.secondary }}
        >
          Five threads, one throughline: less manual work, more time for the
          parts of tax that actually need a human.
        </Typography>

        <Box
          component="ul"
          sx={{
            ...proseSx,
            m: 0,
            pl: 3,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          {engagements.map((engagement) => (
            <Typography key={engagement} component="li" variant="body1" sx={proseSx}>
              {engagement}
            </Typography>
          ))}
        </Box>

        <Typography component="p" variant="body1" sx={{ ...proseSx, mt: 4 }}>
          Different clients, different formats, but it kept coming back to
          the same question every time: where's a person doing something a
          machine could do faster, so that person can go spend their time on
          something a machine can't. Excel, JavaScript, an agent built from
          scratch, didn't matter. That was the actual job.
        </Typography>
      </Box>

      {sectionDivider}

      {/* Reflection */}
      <Box component="section" sx={{ mb: { xs: 5, md: 7 } }}>
        <Typography component="h2" variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          What the Summer Taught Me
        </Typography>
        <Typography
          component="p"
          variant="body1"
          sx={{ ...proseSx, mb: 3, color: theme.palette.text.secondary }}
        >
          A few things I didn't fully believe until I lived them.
        </Typography>

        {reflectionParagraphs.map((paragraph, index) => (
          <Typography
            key={index}
            component="p"
            variant="body1"
            sx={{ ...proseSx, mb: 2.5 }}
          >
            {paragraph}
          </Typography>
        ))}

        {photo({
          src: "/images/ey/intern-celebration-schools.jpg",
          alt: "Specialty Tax interns lined up at the all-intern celebration, each wearing merch from their own school.",
          caption:
            "Specialty Tax interns at the all-intern celebration, repping our schools.",
          orientation: "portrait",
        })}
      </Box>

      {sectionDivider}

      {/* People */}
      <Box component="section" sx={{ mb: { xs: 5, md: 7 } }}>
        <Typography component="h2" variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          People I'm Grateful For
        </Typography>
        <Typography
          component="p"
          variant="body1"
          sx={{ ...proseSx, mb: 4, color: theme.palette.text.secondary }}
        >
          This is the part of the summer I'll remember longest.
        </Typography>

        {photo({
          src: "/images/ey/ttt-team-dinner.jpg",
          alt: "The TTT team at a dinner in Chicago.",
          caption:
            "The TTT team at a Chicago dinner, on the night the air quality hit 500 from the Canadian wildfire smoke.",
          orientation: "landscape",
        })}

        <Typography component="p" variant="body1" sx={{ ...proseSx, mb: 2.5 }}>
          Worked with a genuinely good team this summer, people who
          onboarded me, reviewed my work, answered questions I probably
          should've already known the answer to, and made room for a summer
          intern without making it a whole thing. That mattered more than any
          single project did.
        </Typography>
        <Typography component="p" variant="body1" sx={proseSx}>
          Same goes for the other interns: training week, the cutover
          weekend, the group chats that kept everyone sane along the way.
          Good group to go through the summer with.
        </Typography>

        {photo({
          src: "/images/ey/ticket-to-ride.jpg",
          alt: "A few interns playing Ticket to Ride around a table.",
          caption: "Mid-game of Ticket to Ride with a few fellow interns.",
          orientation: "portrait",
        })}
      </Box>

      {sectionDivider}

      {/* Closing */}
      <Box component="section" sx={{ mb: { xs: 5, md: 6 } }}>
        {photo({
          src: "/images/ey/cassie-last-day.jpg",
          alt: "Zekarias and a co-intern smiling together on their last day working together.",
          caption: "With a co-intern, on our last day working together.",
          orientation: "portrait",
        })}
        <Typography
          component="p"
          variant="body1"
          sx={{
            ...proseSx,
            fontSize: "1.1rem",
            fontWeight: 500,
          }}
        >
          Eight weeks on paper. Longer than that in practice. If you're
          reading this and we worked together this summer, thanks. Hope our
          paths cross again.
        </Typography>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          pt: 3,
          borderTop: `1px solid ${theme.palette.text.primary}`,
          borderTopColor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.08)",
        }}
      >
        <Typography
          component="p"
          variant="body2"
          sx={{ color: theme.palette.text.secondary, opacity: 0.7 }}
        >
          About this page: written in the first person after my last day.
          Every client is anonymized: no logos, no forms, no screenshots,
          just what the summer actually felt like.
        </Typography>
      </Box>
      </Box>
    </Box>
  );
};

export default EYInternship;
