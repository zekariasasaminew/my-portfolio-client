import type { ReactNode } from "react";
import { Box, Typography, ButtonBase } from "@mui/material";
import { motion } from "framer-motion";
import { usePostColors } from "./usePostColors";

interface FigureProps {
  label: string;
  title: string;
  caption?: ReactNode;
  onReplay?: () => void;
  minContentWidth?: number;
  children: ReactNode;
}

const Figure = ({ label, title, caption, onReplay, minContentWidth, children }: FigureProps) => {
  const c = usePostColors();

  return (
    <Box
      component={motion.figure}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
      sx={{
        m: 0,
        my: { xs: 4, md: 5 },
        border: `1px solid ${c.line}`,
        borderRadius: "12px",
        background: c.panel,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          px: { xs: 2, md: 2.5 },
          py: 1.25,
          borderBottom: `1px solid ${c.line}`,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
          fontSize: "0.72rem",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        <Box component="span" sx={{ color: c.muted }}>
          <Box component="span" sx={{ color: c.accent, mr: 1 }}>
            {label}
          </Box>
          {title}
        </Box>
        {onReplay && (
          <ButtonBase
            onClick={onReplay}
            aria-label={`Replay: ${title}`}
            sx={{
              fontFamily: "inherit",
              fontSize: "inherit",
              letterSpacing: "inherit",
              textTransform: "inherit",
              color: c.accent,
              border: `1px solid ${c.line}`,
              borderRadius: "6px",
              px: 1,
              py: 0.25,
            }}
          >
            ↻ replay
          </ButtonBase>
        )}
      </Box>
      <Box sx={{ p: { xs: 1.5, md: 2.5 }, overflowX: minContentWidth ? "auto" : undefined, scrollbarColor: `${c.line} transparent` }}>
        <Box sx={{ minWidth: minContentWidth }}>{children}</Box>
      </Box>
      {caption && (
        <Typography
          component="figcaption"
          variant="body2"
          sx={{
            px: { xs: 2, md: 2.5 },
            pb: 2,
            color: c.muted,
            lineHeight: 1.6,
          }}
        >
          {caption}
        </Typography>
      )}
    </Box>
  );
};

export default Figure;
