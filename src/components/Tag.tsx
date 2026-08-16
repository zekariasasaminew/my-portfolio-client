import { useState } from "react";
import { Box, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";

interface TagProps {
  label: string;
  iconSlug?: string;
  iconMonochrome?: boolean;
  fontWeight?: number;
  fontSize?: string;
  iconSize?: string;
}

const Tag = ({
  label,
  iconSlug,
  iconMonochrome,
  fontWeight,
  fontSize = "0.7rem",
  iconSize = "0.9rem",
}: TagProps) => {
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
        py: 0.35,
        borderRadius: 0.75,
        fontSize,
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
          src={`https://api.iconify.design/${iconSlug}.svg`}
          alt=""
          onError={() => setIconFailed(true)}
          sx={{
            width: iconSize,
            height: iconSize,
            flexShrink: 0,
            filter: iconMonochrome && theme.palette.mode === "dark" ? "invert(1)" : "none",
          }}
        />
      )}
      {label}
    </Box>
  );
};

export default Tag;
