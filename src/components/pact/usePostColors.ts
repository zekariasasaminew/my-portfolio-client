import { useTheme } from "@mui/material";

export interface PostColors {
  accent: string;
  blue: string;
  green: string;
  red: string;
  purple: string;
  amber: string;
  text: string;
  muted: string;
  line: string;
  panel: string;
  panelStrong: string;
  bg: string;
}

export function usePostColors(): PostColors {
  const theme = useTheme();
  if (theme.palette.mode === "dark") {
    return {
      accent: "#F0883E",
      blue: "#58A6FF",
      green: "#3FB950",
      red: "#F85149",
      purple: "#BC8CFF",
      amber: "#E3B341",
      text: "rgba(255,255,255,0.87)",
      muted: "rgba(255,255,255,0.55)",
      line: "rgba(255,255,255,0.16)",
      panel: "rgba(255,255,255,0.03)",
      panelStrong: "#1f1f1f",
      bg: "#161616",
    };
  }
  return {
    accent: "#C2410C",
    blue: "#1D4ED8",
    green: "#15803D",
    red: "#B91C1C",
    purple: "#7E22CE",
    amber: "#A16207",
    text: "#241F1A",
    muted: "rgba(36,31,26,0.6)",
    line: "rgba(36,31,26,0.2)",
    panel: "rgba(36,31,26,0.03)",
    panelStrong: "#F3EBDA",
    bg: "#FAF3E7",
  };
}
