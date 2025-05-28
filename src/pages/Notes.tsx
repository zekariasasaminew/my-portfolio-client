import { Box, Typography, Link, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import BookIcon from "@mui/icons-material/Book";
import Navbar from "../components/Navbar";
import { notes } from "../data/notes"; // Assuming you have a notes data file
import type { Note } from "../types/note"; // Assuming you have a Note type defined

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
                    }}
                  >
                    →
                  </Typography>
                  <Box>
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
                      <Typography variant="body1" sx={{ mb: 0.5 }}>
                        {note.title}
                      </Typography>
                    </Link>
                    <Typography variant="body2" color="text.secondary">
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
