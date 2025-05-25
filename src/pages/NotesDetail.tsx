import { notes } from "../data/notes";
import Navbar from "../components/Navbar";
import { Box, Typography, useTheme } from "@mui/material";
import { useParams } from "react-router-dom";

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
              }}
            >
              →
            </Typography>
            <Box>
              <Typography variant="body1" sx={{ mb: 0.5, fontWeight: 500 }}>
                {note.content}
              </Typography>
              <Typography variant="body2" color="text.secondary">
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
