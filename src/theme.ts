import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#111418", // richer dark gray
      paper: "rgba(28, 33, 40, 0.8)", // soft glassmorphism
    },
    primary: {
      main: "#64b5f6", // modern soft blue
    },
    secondary: {
      main: "#ce93d8", // muted lavender
    },
    text: {
      primary: "#f5f5f5",
      secondary: "#9e9e9e",
    },
  },
  typography: {
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', sans-serif",
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
      letterSpacing: "-0.5px",
    },
    h2: {
      fontWeight: 600,
      fontSize: "2rem",
    },
    h3: {
      fontWeight: 500,
      fontSize: "1.5rem",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.7,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(12px)",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.05)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          fontWeight: 500,
          paddingInline: "20px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(36, 41, 46, 0.9)",
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.04)",
        },
      },
    },
  },
});

export default theme;
