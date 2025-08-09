import { Box, Typography, Link, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import BookIcon from "@mui/icons-material/Book";
import Navbar from "../components/Navbar";
import { notes } from "../data/notes";
import ReactMarkdown from "react-markdown";

interface NotesProps {
  toggleColorMode: () => void;
}

const Notes = ({ toggleColorMode }: NotesProps) => {
  const theme = useTheme();

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
        zIndex: 2,
      }}
    >
      <Navbar toggleColorMode={toggleColorMode} />

      {/* Notes Content */}
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 4,
            fontWeight: 500,
          }}
        >
          notes
        </Typography>

        {/* Notes Section */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <BookIcon
              sx={{
                fontSize: "1.5rem",
                opacity: 0.8,
                color: theme.palette.mode === "dark" ? "#9C27B0" : "#6A1B9A",
              }}
            />
            <Typography
              variant="body1"
              sx={{
                fontSize: "1.1rem",
                fontWeight: 500,
              }}
            >
              Recent Thoughts & Learnings
            </Typography>
          </Box>
          <Box sx={{ pl: "2.25rem" }}>
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
              {notes.map((note, idx) => (
                <li key={idx}>
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
                    <Link
                      href={`/notes/${note.id}`}
                      sx={{
                        color: "inherit",
                        textDecoration: "none",
                        display: "block",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          mb: 0.5,
                          fontWeight: 500,
                          "& strong": { fontWeight: 600 },
                          "& em": { fontStyle: "italic" },
                          "& code": {
                            backgroundColor:
                              theme.palette.mode === "dark"
                                ? "#2d3748"
                                : "#f7fafc",
                            color:
                              theme.palette.mode === "dark"
                                ? "#e2e8f0"
                                : "#2d3748",
                            padding: "0.125rem 0.25rem",
                            borderRadius: "0.25rem",
                            fontSize: "0.875rem",
                            fontFamily:
                              'Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                          },
                        }}
                      >
                        <ReactMarkdown>{note.title}</ReactMarkdown>
                      </Typography>
                    </Link>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 1,
                        opacity: 0.8,
                        lineHeight: 1.5,
                        display: "-webkit-box",
                        "-webkit-line-clamp": 2,
                        "-webkit-box-orient": "vertical",
                        overflow: "hidden",
                        "& p": { margin: 0 },
                        "& strong": { fontWeight: 600 },
                        "& em": { fontStyle: "italic" },
                        "& code": {
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "#2d3748"
                              : "#f7fafc",
                          color:
                            theme.palette.mode === "dark"
                              ? "#e2e8f0"
                              : "#2d3748",
                          padding: "0.1rem 0.2rem",
                          borderRadius: "0.2rem",
                          fontSize: "0.8rem",
                          fontFamily:
                            'Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                        },
                      }}
                    >
                      <ReactMarkdown>
                        {note.content[0].substring(0, 150) +
                          (note.content[0].length > 150 ? "..." : "")}
                      </ReactMarkdown>
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: "0.875rem", fontWeight: 500 }}
                    >
                      {"tags: " + note.tags.join(", ")}
                    </Typography>
                  </Box>
                </li>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Notes;
