import { memo } from "react";
import { Box, Typography, Link, useTheme } from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import ScienceIcon from "@mui/icons-material/Science";
import WebIcon from "@mui/icons-material/Web";
import SchoolIcon from "@mui/icons-material/School";
import type { Experience } from "../types/experience";

const icons = {
  code: CodeIcon,
  science: ScienceIcon,
  web: WebIcon,
  school: SchoolIcon,
} as const;

interface ExperienceCardProps {
  experience: Experience;
}

const ExperienceCard = memo(({ experience }: ExperienceCardProps) => {
  const theme = useTheme();
  const Icon = icons[experience.iconType];

  return (
    <Box
      sx={{
        mb: 6,
        "&:hover": {
          "& .company": {
            textDecoration: "underline",
          },
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
        <Icon
          sx={{
            fontSize: "1.5rem",
            opacity: 0.8,
            color:
              theme.palette.mode === "dark"
                ? experience.themeColor.dark
                : experience.themeColor.light,
          }}
        />
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.1rem",
            fontWeight: 500,
            "& .company": {
              color:
                theme.palette.mode === "dark"
                  ? experience.themeColor.dark
                  : experience.themeColor.light,
              letterSpacing: "0.02em",
              transition: "text-decoration 0.2s ease",
            },
          }}
        >
          {experience.title} @{" "}
          {experience.companyUrl ? (
            <Link
              href={experience.companyUrl}
              target="_blank"
              className="company"
              sx={{
                color: "inherit",
                textDecoration: "none",
              }}
            >
              {experience.company}
            </Link>
          ) : (
            <span className="company">{experience.company}</span>
          )}
        </Typography>
      </Box>
      <Typography
        variant="body2"
        sx={{
          mb: 2,
          color: theme.palette.text.secondary,
          ml: "2.25rem",
          "& .location": {
            color: theme.palette.text.primary,
            fontWeight: 500,
            "&::before": {
              content: '"📍 "',
              opacity: 0.7,
            },
          },
        }}
      >
        {experience.startDate} - {experience.endDate} •{" "}
        <span className="location">{experience.location}</span>
      </Typography>
      <Box sx={{ pl: "2.25rem" }}>
        <Typography
          variant="body1"
          fontWeight="300"
          component="ul"
          sx={{
            listStyle: "none",
            p: 0,
            "& li": {
              mb: 1,
              "&::before": {
                content: '"→"',
                marginRight: "8px",
                color: theme.palette.text.secondary,
              },
              "&:last-child": {
                mb: 0,
              },
            },
          }}
        >
          {experience.points.map((point, index) => (
            <li key={`${experience.company}-point-${index}`}>{point}</li>
          ))}
        </Typography>
      </Box>
    </Box>
  );
});

ExperienceCard.displayName = "ExperienceCard";

export default ExperienceCard;
