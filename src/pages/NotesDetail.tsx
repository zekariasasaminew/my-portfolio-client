import { notes, readingMinutes } from "../data/notes";
import Navbar from "../components/Navbar";
import { Box, Link, Typography, useTheme } from "@mui/material";
import { Link as RouterLink, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

const ACCENT = "#7fd8a6";

const NotesDetail = () => {
  const theme = useTheme();
  const { id } = useParams();
  const note = notes.find((n) => n.id === Number(id));

  if (!note) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: { xs: "2rem", md: "4rem" },
          display: "flex",
          flexDirection: "column",
          color: theme.palette.text.primary,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Typography variant="h6" sx={{ mb: 4, fontWeight: 500 }}>
          Note not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: { xs: "2rem", md: "4rem" },
        color: theme.palette.text.primary,
        position: "relative",
      }}
    >
      <Navbar />
      <Box sx={{ maxWidth: "760px", mx: "auto", mt: { xs: 2, md: 4 } }}>
        <Link
          component={RouterLink}
          to="/notes"
          sx={{ color: "text.secondary", fontFamily: "monospace", fontSize: "0.8rem", textDecoration: "none", "&:hover": { color: ACCENT } }}
        >
          ← all notes
        </Link>
        <Typography
          component="h1"
          sx={{ fontSize: { xs: "1.8rem", md: "2.4rem" }, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2, mt: 2, mb: 1.5 }}
        >
          {note.title}
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1.5, mb: 4, fontFamily: "monospace", fontSize: "0.78rem", color: "text.secondary" }}>
          <span>{readingMinutes(note)} min read</span>
          {note.tags.map((tag) => {
            const label = tag.replace(/^#/, "");
            return (
              <Link
                key={tag}
                component={RouterLink}
                to={`/notes?tag=${encodeURIComponent(label)}`}
                sx={{ color: "inherit", textDecoration: "none", "&:hover": { color: ACCENT } }}
              >
                #{label}
              </Link>
            );
          })}
        </Box>
        <Box component="article" sx={{ minWidth: 0 }}>
          {note.content.map((paragraph: string, idx: number) => (
            <Box
              key={idx}
              sx={{
                mb: 2,
                "& p": { mb: 1.5, fontWeight: 300, lineHeight: 1.7 },
                "& h2": {
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  mb: 1.5,
                  mt: idx === 0 ? 0 : 2,
                  color: theme.palette.text.primary,
                },
                "& h3": {
                  fontSize: "1.1rem",
                  fontWeight: 500,
                  mb: 1,
                  mt: 1.5,
                  color: theme.palette.text.primary,
                },
                "& code": {
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#2d3748" : "#f7fafc",
                  color:
                    theme.palette.mode === "dark" ? "#e2e8f0" : "#2d3748",
                  padding: "0.125rem 0.25rem",
                  borderRadius: "0.25rem",
                  fontSize: "0.875rem",
                  fontFamily:
                    'Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                },
                "& pre": {
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#1a202c" : "#f7fafc",
                  color:
                    theme.palette.mode === "dark" ? "#e2e8f0" : "#2d3748",
                  padding: "1rem",
                  borderRadius: "0.5rem",
                  overflowX: "auto",
                  mb: 1.5,
                  border: `1px solid ${theme.palette.divider}`,
                  "& code": {
                    backgroundColor: "transparent",
                    padding: 0,
                    fontSize: "0.875rem",
                    fontFamily:
                      'Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                  },
                },
                "& ul": {
                  paddingLeft: "1.5rem",
                  mb: 1.5,
                  "& li": {
                    mb: 0.5,
                    listStyle: "disc",
                    display: "list-item",
                  },
                },
                "& ol": {
                  paddingLeft: "1.5rem",
                  mb: 1.5,
                  "& li": {
                    mb: 0.5,
                    listStyle: "decimal",
                    display: "list-item",
                  },
                },
                "& blockquote": {
                  borderLeft: `4px solid ${theme.palette.primary.main}`,
                  paddingLeft: "1rem",
                  margin: "1rem 0",
                  fontStyle: "italic",
                  color: theme.palette.text.secondary,
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.02)"
                      : "rgba(0, 0, 0, 0.02)",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.25rem",
                },
                "& strong": {
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                },
                "& a": {
                  color: theme.palette.mode === "dark" ? ACCENT : "#0a8f4f",
                  fontWeight: 500,
                  textDecoration: "underline",
                  textDecorationColor: "currentColor",
                  textUnderlineOffset: "3px",
                  "&:hover": { textDecorationThickness: "2px" },
                },
                "& a strong": { color: "inherit" },
                "& em": {
                  fontStyle: "italic",
                  color: theme.palette.text.secondary,
                },
              }}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
              >
                {paragraph}
              </ReactMarkdown>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default NotesDetail;
