import { useState } from "react";
import { Box, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";

type Motif = "soccer" | "chess" | "pool";

const SoccerBall = () => (
  <svg viewBox="0 0 256 256" width="100%" height="100%">
    <path
      fill="currentColor"
      d="M128 28a100 100 0 1 0 100 100A100.11 100.11 0 0 0 128 28m40.87 147.42l-11.69-16.09l13.95-40.64l18.93-6.15l29.65 22.74a91.3 91.3 0 0 1-12.9 40.14Zm-81.74 0H49.19a91.3 91.3 0 0 1-12.9-40.14l29.65-22.74l18.93 6.15l13.95 40.64ZM51.69 76.66l8.87 29.92L36 125.39a91.4 91.4 0 0 1 15.69-48.73M106.13 156l-13.36-38.92L128 92.85l35.23 24.23L149.87 156Zm89.31-49.42l8.87-29.92A91.4 91.4 0 0 1 220 125.39Zm2.87-37.84l-10.72 36.19l-19 6.16L132 85.9V66.1l32.68-22.46a92.44 92.44 0 0 1 33.63 25.1m-42.77-28.53L128 59.15l-27.54-18.94a92.2 92.2 0 0 1 55.08 0m-64.22 3.43L124 66.1v19.8l-36.64 25.19l-19-6.16l-10.67-36.19a92.44 92.44 0 0 1 33.63-25.1M54.61 183.42h31.73l11.1 31.36a92.46 92.46 0 0 1-42.83-31.36m52.3 34.14l-13.27-37.5L105.32 164h45.36l11.68 16.06l-13.27 37.5a92.4 92.4 0 0 1-42.18 0m51.65-2.78l11.1-31.36h31.73a92.46 92.46 0 0 1-42.83 31.36"
    />
  </svg>
);

const ChessKnight = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%">
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.2"
      d="m8 16l-1.447.724a1 1 0 0 0-.553.894V20h12v-2.382a1 1 0 0 0-.553-.894L16 16zM9 3l1 3l-3.491 2.148A1 1 0 0 0 7.033 10H10l-2.073 6h7.961L16 11c0-3-1.09-5.983-4-7Q9.09 2.983 9 3"
    />
  </svg>
);

const PoolRack = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%">
    <path
      fill="currentColor"
      d="m20.31 16.44l-5.77-9.97a2.98 2.98 0 0 0-4.08-1.09c-.46.26-.83.62-1.1 1.09L3.6 16.44a2.953 2.953 0 0 0 1.09 4.06c.45.28.96.42 1.49.42h11.55a2.99 2.99 0 0 0 2.98-3c0-.52-.14-1.03-.4-1.48m-14.94.99l5.74-9.96c.27-.47.89-.65 1.35-.37c.16.08.29.21.38.37l5.74 9.96c.27.48.11 1.07-.37 1.36c-.15.09-.32.14-.49.14H6.21c-.55-.01-1-.46-.99-1.01c0-.17.04-.34.13-.49zm6.6-3.98c-1.1 0-1.97-.89-1.97-1.99c0-1.11.87-2 1.97-2a2 2 0 0 1 2 2c0 1.1-.9 1.99-2.02 1.99zm-2.51 4.48c-1.1 0-1.99-.89-1.99-1.99s.89-1.99 1.99-1.99s2 .89 2 1.99s-.9 1.99-2 1.99m4.98 0a2 2 0 0 1-1.99-1.99a2 2 0 0 1 1.99-1.99c1.1 0 2 .89 2 1.99s-.9 1.99-2 1.99"
    />
  </svg>
);

const MOTIFS: Record<Motif, { render: () => React.ReactElement; label: string }> = {
  soccer: { render: SoccerBall, label: "Soccer" },
  chess: { render: ChessKnight, label: "Chess" },
  pool: { render: PoolRack, label: "Pool" },
};

/**
 * Temporary preview switcher so the motif can be picked while reviewing the
 * deployed branch - remove the dot row once a favorite is chosen.
 */
const HeroDoodle = () => {
  const theme = useTheme();
  const [motif, setMotif] = useState<Motif>("soccer");
  const Icon = MOTIFS[motif].render;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
      <Box
        sx={{
          width: { xs: "120px", md: "150px" },
          height: { xs: "120px", md: "150px" },
          color: theme.palette.text.secondary,
          opacity: 0.45,
          animation: "hero-doodle-spin 50s linear infinite",
          "@keyframes hero-doodle-spin": {
            from: { transform: "rotate(0deg)" },
            to: { transform: "rotate(360deg)" },
          },
        }}
      >
        <Icon />
      </Box>

      <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
        {(Object.keys(MOTIFS) as Motif[]).map((key) => (
          <Box
            key={key}
            component="button"
            onClick={() => setMotif(key)}
            title={MOTIFS[key].label}
            sx={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              p: 0,
              bgcolor:
                motif === key
                  ? theme.palette.text.secondary
                  : alpha(theme.palette.text.secondary, 0.25),
              transition: "background-color 0.2s ease",
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default HeroDoodle;
