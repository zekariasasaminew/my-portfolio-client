import { useState } from "react";
import { Box, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";

interface TagProps {
  label: string;
  iconSlug?: string;
  fontWeight?: number;
}

const Tag = ({ label, iconSlug, fontWeight }: TagProps) => {
  const theme = useTheme();
  const [iconFailed, setIconFailed] = useState(false);

  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.6,
        px: 1,
        py: 0.25,
        borderRadius: 0.75,
        fontSize: "0.7rem",
        letterSpacing: "0.3px",
        fontFamily: "monospace",
        fontWeight,
        border: `1px solid ${alpha(theme.palette.text.primary, 0.15)}`,
        color: theme.palette.text.secondary,
        lineHeight: 1.6,
      }}
    >
      {iconSlug && !iconFailed && (
        <Box
          component="img"
          src={`https://cdn.simpleicons.org/${iconSlug}`}
          alt=""
          onError={() => setIconFailed(true)}
          sx={{ width: "0.9rem", height: "0.9rem", flexShrink: 0 }}
        />
      )}
      {label}
    </Box>
  );
};

export default Tag;
