import { useState, useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Experience from "./pages/Experience";
import Notes from "./pages/Notes";
import NotesDetail from "./pages/NotesDetail";
import About from "./pages/About";
import CursorFollower from "./components/CursorFollower";
import { Analytics } from "@vercel/analytics/react";

const BackgroundPattern = () => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: 0,
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='500' height='500' viewBox='0 0 500 500' xmlns='http://www.w3.org/2000/svg'%3E%3Cg transform='rotate(0)'%3E%3Cpath fill='none' stroke='%23444' stroke-width='1' stroke-opacity='0.15' d='M0,250 C150,200 350,200 500,250 C350,300 150,300 0,250 Z M100,250 C200,220 300,220 400,250 C300,280 200,280 100,250 Z M200,250 C250,235 300,235 350,250 C300,265 250,265 200,250 Z'/%3E%3Cpath fill='none' stroke='%23444' stroke-width='1' stroke-opacity='0.15' transform='translate(0,50)' d='M0,250 C150,200 350,200 500,250 C350,300 150,300 0,250 Z M100,250 C200,220 300,220 400,250 C300,280 200,280 100,250 Z'/%3E%3Cpath fill='none' stroke='%23444' stroke-width='1' stroke-opacity='0.15' transform='translate(0,-50)' d='M0,250 C150,200 350,200 500,250 C350,300 150,300 0,250 Z M200,250 C250,235 300,235 350,250 C300,265 250,265 200,250 Z'/%3E%3Cpath fill='none' stroke='%23444' stroke-width='1' stroke-opacity='0.15' transform='translate(0,100)' d='M50,250 C150,220 350,220 450,250 C350,280 150,280 50,250 Z'/%3E%3Cpath fill='none' stroke='%23444' stroke-width='1' stroke-opacity='0.15' transform='translate(0,-100)' d='M50,250 C150,220 350,220 450,250 C350,280 150,280 50,250 Z'/%3E%3Cpath fill='none' stroke='%23444' stroke-width='1' stroke-opacity='0.15' transform='translate(0,150)' d='M0,250 C150,200 350,200 500,250 C350,300 150,300 0,250 Z'/%3E%3Cpath fill='none' stroke='%23444' stroke-width='1' stroke-opacity='0.15' transform='translate(0,-150)' d='M0,250 C150,200 350,200 500,250 C350,300 150,300 0,250 Z'/%3E%3C/g%3E%3C/svg%3E")`,
      backgroundSize: "1000px 1000px",
      opacity: 0.8,
      transform: "rotate(-5deg) scale(1.5)",
      filter: "blur(0.5px)",
    }}
  />
);

function App() {
  const [mode, setMode] = useState<"light" | "dark">(() => {
    const savedMode = localStorage.getItem("themeMode");
    return savedMode === "light" || savedMode === "dark" ? savedMode : "dark";
  });

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "dark"
            ? {
                background: {
                  default: "#0A0A0A",
                  paper: "#121212",
                },
                text: {
                  primary: "rgba(255, 255, 255, 0.87)",
                  secondary: "rgba(255, 255, 255, 0.6)",
                },
              }
            : {
                background: {
                  default: "#fff",
                  paper: "#f5f5f5",
                },
                text: {
                  primary: "rgba(0, 0, 0, 0.87)",
                  secondary: "rgba(0, 0, 0, 0.6)",
                },
              }),
        },
        typography: {
          fontFamily: '"Inter", sans-serif',
          h6: {
            fontSize: "1.1rem",
          },
          body1: {
            fontSize: "0.95rem",
          },
          body2: {
            fontSize: "0.85rem",
          },
        },
      }),
    [mode]
  );

  const toggleColorMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      localStorage.setItem("themeMode", newMode);
      return newMode;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BackgroundPattern />
      <CursorFollower />
      <Analytics />
      <Routes>
        <Route path="/" element={<Home toggleColorMode={toggleColorMode} />} />
        <Route
          path="/about"
          element={<About toggleColorMode={toggleColorMode} />}
        />
        <Route
          path="/experience"
          element={<Experience toggleColorMode={toggleColorMode} />}
        />
        <Route
          path="/notes"
          element={<Notes toggleColorMode={toggleColorMode} />}
        />
        <Route
          path="/notes/:id"
          element={<NotesDetail toggleColorMode={toggleColorMode} />}
        />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
