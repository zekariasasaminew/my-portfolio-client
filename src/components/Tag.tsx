import { Box, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";

const Tag = ({ label }: { label: string }) => {
  const theme = useTheme();
  return (
    <Box
      component="span"
      sx={{
        display: "inline-block",
        px: 1,
        py: 0.25,
        borderRadius: 0.75,
        fontSize: "0.7rem",
        letterSpacing: "0.3px",
        fontFamily: "monospace",
        border: `1px solid ${alpha(theme.palette.text.primary, 0.15)}`,
        color: theme.palette.text.secondary,
        lineHeight: 1.6,
      }}
    >
      {label}
    </Box>
  );
};

export default Tag;
