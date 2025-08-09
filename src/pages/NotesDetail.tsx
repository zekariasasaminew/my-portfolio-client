import { notes } from "../data/notes";
import Navbar from "../components/Navbar";
import { Box, Typography, useTheme } from "@mui/material";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

interface NotesDetailProps {
  toggleColorMode: () => void;
}

const NotesDetail = ({ toggleColorMode }: NotesDetailProps) => {
  const theme = useTheme();
  const { id } = useParams();
  const note = notes.find((n) => n.id === Number(id));

  if (!note) {
    return (
      <Box
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
        <Typography variant="h6" sx={{ mb: 4, fontWeight: 500 }}>
          Note not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        maxWidth: "650px",
        margin: "0 auto",
        padding: { xs: "2rem", md: "4rem" },
        color: theme.palette.text.primary,
        position: "relative",
      }}
    >
      <Navbar toggleColorMode={toggleColorMode} />
      <Box sx={{ pl: "2.25rem", mt: 6 }}>
        <Typography variant="body1" sx={{ mb: 0.5 }}>
          {note.title}
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            mb: 3,
            color: theme.palette.text.secondary,
            fontStyle: "italic",
          }}
        >
          {new Date(note.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Typography>
        <Box
          component="ul"
          sx={{
            listStyle: "none",
            p: 0,
            m: 0,
            "& li": {
              mb: 3,
              display: "flex",
              alignItems: "flex-start",
              gap: 1.5,
            },
          }}
        >
          <li>
            <Typography
              component="span"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 600,
                mr: 1,
                fontSize: "1.1rem",
                lineHeight: 1.8,
                mt: 0.5,
              }}
            >
              →
            </Typography>
            <Box sx={{ flex: 1 }}>
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
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 2,
                  pt: 1,
                  borderTop: `1px solid ${theme.palette.divider}`,
                  fontWeight: 500,
                }}
              >
                {"tags: " + note.tags.join(", ")}
              </Typography>
            </Box>
          </li>
        </Box>
      </Box>
    </Box>
  );
};

export default NotesDetail;
