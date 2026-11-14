import { useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { newestFirst, readingMinutes } from "../data/notes";
import type { Note } from "../types/note";

const ACCENT = "#7fd8a6";
const VISIBLE_TAGS = 10;

const tagLabel = (tag: string) => tag.replace(/^#/, "");

const ALL_TAGS = (() => {
  const counts = new Map<string, number>();
  for (const note of newestFirst) {
    for (const tag of note.tags) counts.set(tagLabel(tag), (counts.get(tagLabel(tag)) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([tag]) => tag);
})();

const noteHref = (note: Note) => note.href ?? `/notes/${note.id}`;

const TagList = ({ tags, active }: { tags: string[]; active: string | null }) => (
  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
    {tags.map((tag) => (
      <Box
        key={tag}
        component="span"
        sx={{
          fontFamily: "monospace",
          fontSize: "0.72rem",
          color: tagLabel(tag) === active ? ACCENT : "text.secondary",        }}
      >
        #{tagLabel(tag)}
      </Box>
    ))}
  </Box>
);

const NoteCard = ({ note, featured, active }: { note: Note; featured?: boolean; active: string | null }) => {
  const theme = useTheme();
  return (
    <Box
      component={RouterLink}
      to={noteHref(note)}
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: featured ? 2 : 1.5,
        height: "100%",
        p: featured ? { xs: 3, md: 4 } : 3,
        borderRadius: 2,
        color: "inherit",
        textDecoration: "none",
        bgcolor: alpha(theme.palette.background.paper, 0.85),
        border: `1px solid ${featured ? alpha(ACCENT, 0.35) : alpha(theme.palette.text.primary, 0.1)}`,
        backgroundImage: featured
          ? `radial-gradient(120% 140% at 100% 0%, ${alpha(ACCENT, 0.12)} 0%, transparent 55%)`
          : "none",
        transition: "transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
        "&:hover, &:focus-visible": {
          transform: "translateY(-3px)",
          borderColor: alpha(ACCENT, 0.6),
          boxShadow: `0 10px 30px ${alpha("#000", 0.35)}`,
        },
        cursor: "pointer",
        "&:focus-visible": { outline: `2px solid ${ACCENT}`, outlineOffset: 3 },
        "&:hover .note-title, &:focus-visible .note-title": { color: ACCENT },
        "&:hover .note-cta-arrow, &:focus-visible .note-cta-arrow": { transform: "translateX(4px)" },
        "&:hover .note-cta, &:focus-visible .note-cta": featured
          ? { bgcolor: ACCENT, color: "#0f1a14" }
          : { color: ACCENT },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "monospace",
          fontSize: "0.72rem",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "text.secondary",
        }}
      >
        <Box component="span" sx={{ color: featured ? ACCENT : "inherit" }}>
          {featured ? "latest" : `${readingMinutes(note)} min read`}
        </Box>
        {featured && <span>{readingMinutes(note)} min read</span>}
      </Box>
      <Typography
        component={featured ? "h2" : "h3"}
        className="note-title"
        sx={{
          transition: "color 0.2s ease",
          fontWeight: 650,
          letterSpacing: "-0.01em",
          lineHeight: 1.25,
          fontSize: featured ? { xs: "1.45rem", md: "1.9rem" } : "1.1rem",
          maxWidth: featured ? "28ch" : "none",
        }}
      >
        {note.title}
      </Typography>
      <Typography
        color="text.secondary"
        sx={{
          lineHeight: 1.6,
          fontSize: featured ? "1rem" : "0.9rem",
          maxWidth: featured ? "60ch" : "none",
          flex: 1,
        }}
      >
        {note.hook}
      </Typography>
      <TagList tags={note.tags} active={active} />
      <Box
        component="span"
        aria-hidden
        className="note-cta"
        sx={{
          alignSelf: "flex-start",
          display: "inline-flex",
          alignItems: "center",
          gap: 0.75,
          mt: 0.5,
          fontFamily: "monospace",
          fontSize: "0.82rem",
          fontWeight: 600,
          transition: "background-color 0.2s ease, color 0.2s ease",
          ...(featured
            ? { px: 2, py: 1, borderRadius: 999, border: `1px solid ${ACCENT}`, color: ACCENT }
            : { color: "text.primary" }),
        }}
      >
        read note
        <Box component="span" className="note-cta-arrow" sx={{ transition: "transform 0.2s ease" }}>
          →
        </Box>
      </Box>
    </Box>
  );
};

const Notes = () => {
  const theme = useTheme();
  const [params, setParams] = useSearchParams();
  const requested = params.get("tag");
  const active = requested && ALL_TAGS.includes(requested) ? requested : null;
  const shown = active ? newestFirst.filter((n) => n.tags.some((t) => tagLabel(t) === active)) : newestFirst;
  const [featured, ...rest] = shown;
  const [showAllTags, setShowAllTags] = useState(false);
  const visibleTags =
    showAllTags || ALL_TAGS.indexOf(active ?? "") >= VISIBLE_TAGS ? ALL_TAGS : ALL_TAGS.slice(0, VISIBLE_TAGS);
  const hiddenCount = ALL_TAGS.length - visibleTags.length;

  const chip = (tag: string | null, label: string, onClick?: () => void) => {
    const selected = !onClick && tag === active;
    return (
      <Box
        key={label}
        component="button"
        type="button"
        aria-pressed={onClick ? undefined : selected}
        onClick={onClick ?? (() => setParams(tag ? { tag } : {}, { replace: true }))}
        sx={{
          all: "unset",
          cursor: "pointer",
          px: 1.5,
          py: 0.5,
          borderRadius: 999,
          fontFamily: "monospace",
          fontSize: "0.78rem",
          border: `1px solid ${selected ? ACCENT : alpha(theme.palette.text.primary, 0.15)}`,
          color: selected ? "#0f1a14" : "text.secondary",
          bgcolor: selected ? ACCENT : "transparent",
          transition: "all 0.15s ease",
          "&:hover": { borderColor: ACCENT, color: selected ? "#0f1a14" : "text.primary" },
          "&:focus-visible": { outline: `2px solid ${ACCENT}`, outlineOffset: 2 },
        }}
      >
        {label}
      </Box>
    );
  };

  return (
    <Box
      component={motion.main}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      sx={{
        minHeight: "100vh",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: { xs: "2rem 1rem", sm: "2rem", md: "4rem" },
        color: theme.palette.text.primary,
        position: "relative",
        zIndex: 2,
      }}
    >
      <Navbar />

      <Box component="header" sx={{ mb: { xs: 4, md: 5 } }}>
        <Typography
          component="h1"
          sx={{ fontSize: { xs: "2.2rem", md: "3rem" }, fontWeight: 700, letterSpacing: "-0.03em", mb: 1 }}
        >
          notes<Box component="span" sx={{ color: ACCENT }}>.</Box>
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: "56ch", lineHeight: 1.6 }}>
          my safe space for things i built, broke, and figured out. half-baked takes welcome.
        </Typography>
      </Box>

      <Box
        role="group"
        aria-label="Filter notes by tag"
        sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: { xs: 3, md: 4 } }}
      >
        {chip(null, "all")}
        {visibleTags.map((tag) => chip(tag, `#${tag}`))}
        {hiddenCount > 0 && chip(null, `+${hiddenCount} more`, () => setShowAllTags(true))}
      </Box>

      {featured && (
        <Box component={motion.div} key={`f-${active}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} sx={{ mb: 3 }}>
          <NoteCard note={featured} featured active={active} />
        </Box>
      )}

      {rest.length > 0 && (
        <Box
          component="ul"
          sx={{
            listStyle: "none",
            p: 0,
            m: 0,
            display: "grid",
            gap: 3,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
          }}
        >
          {rest.map((note, i) => (
            <Box
              component={motion.li}
              key={`${active}-${note.id}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * (i + 1) }}
            >
              <NoteCard note={note} active={active} />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Notes;
