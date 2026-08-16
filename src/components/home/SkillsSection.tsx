import { Box, Typography, useTheme } from "@mui/material";
import { skillGroups } from "../../data/skills";
import Tag from "../Tag";

const SkillsSection = () => {
  const theme = useTheme();

  return (
    <Box component="section" id="skills" sx={{ scrollMarginTop: "5rem", mb: { xs: 6, md: 8 } }}>
      <Typography component="h2" variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        skills &amp; technologies
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" },
          gap: 4,
        }}
      >
        {skillGroups.map((group) => (
          <Box key={group.label}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                mb: 1.5,
                color: theme.palette.text.secondary,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontSize: "0.75rem",
              }}
            >
              {group.label}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
              {group.items.map((item) => (
                <Tag key={item} label={item} />
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SkillsSection;
