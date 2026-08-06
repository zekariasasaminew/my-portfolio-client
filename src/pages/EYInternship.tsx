import { Box, Typography, Divider, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

interface EYInternshipProps {
  toggleColorMode: () => void;
}

interface Engagement {
  title: string;
  context: string;
  body: string;
}

interface Person {
  name: string;
  role: string;
  body: string;
}

interface PeopleGroup {
  title: string;
  people: Person[];
}

const engagements: Engagement[] = [
  {
    title: "A Global Animal Health Company",
    context:
      "An indirect tax project built around a stack of client-provided documents that all needed to agree with each other.",
    body: "Most of my time here went into consolidating and cross-checking spreadsheets, client files against our own analyses, line by line. I used AI to speed up the repetitive parts of that comparison work, but the bigger lesson came from where I slowed down instead: the tax-technical reasoning behind a given cell rarely shows up in the file itself. I learned to ask what a number meant before I touched it, not after.",
  },
  {
    title: "A Fortune 100 Electronics Distributor",
    context:
      "A certificate-processing workflow ahead of a hard deadline: a multi-day cutover.",
    body: "I wrote a JavaScript automation for part of the certificate workflow, then walked the team through the logic so they could validate it against what the project actually needed. Their feedback changed a few assumptions I'd baked in, and the revised version held up. Over four days, the team processed more than 70,000 certificates, and the automation carried a real share of that load. It was the first time I'd built something and watched it work under actual pressure, not just in a test file.",
  },
  {
    title: "A Supermajor Energy Client",
    context:
      "Country-by-country e-invoicing design on SAP S/4HANA, across several jurisdictions.",
    body: "I contributed to design work spanning multiple countries, including Belgium's self-billing flow through a PEPPOL-certified access point, and country design slides for a few Latin American markets. Most of my hands-on work was building and refining the process-flow diagrams and legends that anchor those design documents, which meant sitting with how the accounting side actually behaves and making sure the diagrams told the same story.",
  },
  {
    title: "Vertex Taxability Matrix Work",
    context: "A state-by-state taxability review, done the slow way on purpose.",
    body: "I merged a Vertex taxability matrix against a client's product and category matrix across the US, state by state, then audited the result row by row, translating Vertex's shorthand (E, T, T-star, D) into plain-English taxability for each state and category pair. It was tedious in the way that matters: the mismatches I caught sat at the exact intersection where a wrong assumption would have counted most.",
  },
  {
    title: "An Internal AI Initiative",
    context: "The project I'm proudest of, because it started with listening.",
    body: "I designed a product taxonomy classification agent in the firm's internal agent studio. When we ran into its limits, I wrote an architecture design document for a custom agent to close the gaps we'd found. What makes this one stick with me is where it started: not with a tool I wanted to try, but with paying attention to how the team actually spends its time.",
  },
];

const reflectionParagraphs: string[] = [
  "The most useful thing I brought to any project wasn't a script or a shortcut, it was a good question asked early. Tax has more depth than I gave it credit for walking in, and I got better over the summer at pausing before I automated anything, because the fastest way to build the wrong tool is to skip the part where you ask what the work is actually for.",
  "Being trusted with real client work, even in small slices, changed how I read a set of requirements and how I reviewed my own output before sending it along. Ownership feels different when there's a client on the other end of the thing you're doing, and I noticed myself double-checking things I might have glossed over in a school project.",
  "Every win I had with AI came from noticing a manual pattern first and only then reaching for a tool, whether that tool ended up being a script, an agent, or just a better Excel formula. AI didn't do the thinking for me. It did the repeating, once I'd figured out what was worth repeating.",
  "Explaining my logic to a reviewer, walking someone through a design doc, or just writing a clear message mattered as much as the work behind it. I got better at saying what I meant the first time, because the alternative was a longer conversation later.",
  "And under all of it were the people who made the summer what it was. That's not a side note. It's most of the story, and it's next.",
];

const competencies: { name: string; note: string }[] = [
  {
    name: "Critical Thinking",
    note: "Slowed down more, assumed less. The best fixes came after the second question, not the first.",
  },
  {
    name: "Time Management",
    note: "Learned to size up a task before diving in, especially with a cutover deadline that wasn't moving.",
  },
  {
    name: "Client Trust and Value",
    note: "Trust got built in small, reviewed deliverables. It was never declared upfront.",
  },
  {
    name: "Communicating with Impact",
    note: "Got sharper at saying the important thing first, then the detail.",
  },
  {
    name: "Leading with Questions",
    note: "Traded my instinct to guess for the habit of asking, especially in unfamiliar tax territory.",
  },
  {
    name: "Relationship Building",
    note: "Coffee chats turned out to matter as much as any deliverable. Maybe more.",
  },
];

const peopleGroups: PeopleGroup[] = [
  {
    title: "The One Who Anchored It All",
    people: [
      {
        name: "Filo",
        role: "my counselor",
        body: "Every internship needs one person who patiently opens every door, and mine was Filo. She onboarded me into her client and internal meetings, walked me through the day-to-day, gave me real tasks, and then took the time to review them with feedback that actually made me better. Our weekly one-on-ones over coffee turned into conversations about career, about being an international student, and about the long game. She showed me what steady, generous mentorship looks like.",
      },
    ],
  },
  {
    title: "The Recruiter Who Was There Before, During, and After",
    people: [
      {
        name: "Stephanie",
        role: "my recruiter",
        body: "Stephanie was the pillar of the whole experience: pre-arrival logistics, a mid-summer immigration situation handled with the visa and immigration team, and every small \"who do I even ask about this\" moment in between. We also bonded over the Midwest. She's from Des Moines, I'm from the Quad Cities, and I got very lucky landing with a recruiter who already understood exactly where I was coming from.",
      },
    ],
  },
  {
    title: "Peer Buddies and Early Guides",
    people: [
      {
        name: "Quang",
        role: "peer buddy",
        body: "Quang was the first teammate I met in person, at the training hotel, before the internship even officially began. He'd already been my pre-interview peer buddy and helped me prep for it. We ended up bonding over football and the World Cup, and that made the first nervous days a lot easier.",
      },
      {
        name: "Brian",
        role: "peer buddy",
        body: "Brian gave me weekly one-on-ones, pointed me to the same training material that had helped him when he started, got me access to the Vertex sandbox so I could teach myself the basics, and offered steady guidance the whole way through.",
      },
      {
        name: "Corey",
        role: "senior manager",
        body: "Corey and I spoke before I even started, and that conversation set my expectations for team dynamics and the day-to-day. Travel and a firm break kept us from working together as closely as either of us probably wanted, but shadowing his calls and asking questions afterward was some of the best learning of the summer.",
      },
    ],
  },
  {
    title: "The People I Worked Closely With",
    people: [
      {
        name: "Jordyn",
        role: "manager",
        body: "Jordyn led my first real client-facing engagement. She was patient explaining things that were new to me, gave me tasks with real review and feedback, and brought a warmth that made it easy to ask questions instead of guessing. She's a big part of how I learned what great client service actually looks like.",
      },
      {
        name: "Kaye",
        role: "manager",
        body: "Kaye and I worked closely during the certificate cutover weekend. She backed the automation idea when it was still just an idea, gave sharp feedback on the logic, and helped it land inside the broader team effort instead of staying a side project.",
      },
      {
        name: "Forrest",
        role: "AI initiative",
        body: "Forrest was my partner on the agent-studio classifier and the custom-agent architecture doc. He walked me through how the team used to do this work so I could actually see what \"old way versus new way\" meant, and his feedback was the kind I looked forward to getting.",
      },
      {
        name: "Michael",
        role: "executive director",
        body: "What started as a research request in the team's lounge chat turned into a small analysis project with Michael. He was a delight to work with, and a good reminder that saying yes to low-stakes asks is usually worth it.",
      },
      {
        name: "Bhakti",
        role: "collaborator",
        body: "Bhakti and I worked together on both the animal-health and electronics-distributor projects. I'm grateful for the day-to-day partnership, the kind that makes the actual grind of a project easier to get through.",
      },
    ],
  },
  {
    title: "The Coffee Chats I'll Remember",
    people: [
      {
        name: "Kate and Rob",
        role: "New York and Hoboken",
        body: "Different offices meant we never overlapped on client work, but our early coffee chats shaped how I thought about standing out on the team from day one.",
      },
      {
        name: "Chris",
        role: "manager",
        body: "Chris interviewed me for the role. We never got to work together directly, but I want to thank him for trusting me enough to bring me in and let me contribute.",
      },
    ],
  },
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
        maxWidth: "760px",
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
        <Typography component="div" variant="body1" sx={{ ...proseSx, mb: 2 }}>
          This summer I spent eight weeks in Chicago on EY's Tax Transformation
          team, inside the Tax Technology and Transformation practice, working
          on indirect tax projects at a Big Four firm. I went in hoping to find
          the overlap between computer science and tax work, somewhere I could
          use automation and AI without losing sight of the tax logic
          underneath it.
        </Typography>
        <Typography component="div" variant="body1" sx={proseSx}>
          I found more of that overlap than I expected, plus a cutover
          weekend, a taxability matrix with more nuance than any spreadsheet
          lets on, and a chance to design an AI agent from the ground up. What
          surprised me most wasn't the work itself. It was how many people
          made room for a summer intern and meant it. That part of the story
          comes later on this page, and it's the part I care about most.
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
          sx={{ ...proseSx, mb: 4, color: theme.palette.text.secondary }}
        >
          Five threads, one throughline: less manual work, more time for the
          parts of tax that actually need a human.
        </Typography>

        {engagements.map((engagement) => (
          <Box key={engagement.title} sx={{ mb: 4 }}>
            <Typography
              component="h3"
              variant="h6"
              sx={{ fontWeight: 600, mb: 0.5 }}
            >
              {engagement.title}
            </Typography>
            <Typography
              component="p"
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontStyle: "italic",
                mb: 1,
                maxWidth: "70ch",
              }}
            >
              {engagement.context}
            </Typography>
            <Typography component="p" variant="body1" sx={proseSx}>
              {engagement.body}
            </Typography>
          </Box>
        ))}

        <Typography component="p" variant="body1" sx={{ ...proseSx, mt: 5 }}>
          Different clients, different formats, same throughline. Whether it
          was Excel, JavaScript, or an agent built from scratch, the work
          always came back to the same question: where is a person doing
          something a machine could do faster, so that the person can go do
          something a machine can't.
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
          Five things I didn't fully believe until I lived them.
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

        {/* How I grew: stylized, self-authored competency summary */}
        <Box sx={{ mt: 5 }}>
          <Typography
            component="h3"
            variant="subtitle1"
            sx={{ fontWeight: 600, mb: 2 }}
          >
            How I Grew
          </Typography>
          <Typography
            component="p"
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              mb: 3,
              maxWidth: "70ch",
            }}
          >
            Six areas the summer stretched me in, in my own words, not a
            lifted form.
          </Typography>
          <Box
            component="ul"
            sx={{
              listStyle: "none",
              p: 0,
              m: 0,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            {competencies.map((competency) => (
              <Box
                component="li"
                key={competency.name}
                sx={{
                  p: 2.5,
                  borderRadius: "12px",
                  border: `1px solid ${accent}33`,
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.02)"
                      : "rgba(0,0,0,0.015)",
                }}
              >
                <Typography
                  component="p"
                  variant="body2"
                  sx={{ fontWeight: 600, mb: 0.75, color: accent }}
                >
                  {competency.name}
                </Typography>
                <Typography
                  component="p"
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary, lineHeight: 1.6 }}
                >
                  {competency.note}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
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
          This is the part of the summer I'll remember longest, so here it is
          in full.
        </Typography>

        {photo({
          src: "/images/ey/ttt-team-dinner.jpg",
          alt: "The TTT team at a dinner in Chicago.",
          caption:
            "The TTT team at a Chicago dinner, on the night the air quality hit 500 from the Canadian wildfire smoke.",
          orientation: "landscape",
        })}

        {peopleGroups.map((group) => (
          <Box key={group.title} sx={{ mb: 4 }}>
            <Typography
              component="h3"
              variant="subtitle1"
              sx={{ fontWeight: 600, mb: 2, color: accent }}
            >
              {group.title}
            </Typography>
            {group.people.map((person) => (
              <Typography
                key={person.name}
                component="p"
                variant="body1"
                sx={{ ...proseSx, mb: 2.5 }}
              >
                <Box component="strong" sx={{ fontWeight: 700 }}>
                  {person.name}
                </Box>{" "}
                ({person.role}). {person.body}
              </Typography>
            ))}
            {group.title === "Peer Buddies and Early Guides" &&
              photo({
                src: "/images/ey/ticket-to-ride.jpg",
                alt: "Quang, Chris, and Brian playing Ticket to Ride around a table.",
                caption: "Quang, Chris, and Brian, mid-game of Ticket to Ride.",
                orientation: "portrait",
              })}
          </Box>
        ))}
      </Box>

      {sectionDivider}

      {/* Closing */}
      <Box component="section" sx={{ mb: { xs: 5, md: 6 } }}>
        {photo({
          src: "/images/ey/cassie-last-day.jpg",
          alt: "Zekarias and Cassie, his co-intern, smiling together on their last day working together.",
          caption: "Cassie, my co-intern, on our last day working together.",
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
          Eight weeks, on paper. In practice, a group of people who invested in
          me. If you're reading this and we worked together this summer: thank
          you. I hope our paths cross again.
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
          Names are first names only, and every client is anonymized. No logos,
          no forms, no screenshots, just what the summer actually felt like.
        </Typography>
      </Box>
    </Box>
  );
};

export default EYInternship;
