import { memo } from "react";
import { Box, Typography, Link, useTheme } from "@mui/material";
import ReactMarkdown from "react-markdown";
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
        maxWidth: "none", // Remove width constraints
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
          variant="h6"
          sx={{
            fontSize: "1.5rem",
            fontWeight: 800,
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
        <Box
          component="ul"
          sx={{
            listStyle: "none",
            p: 0,
            m: 0,
            "& li": {
              mb: 1.5,
              lineHeight: 1.7,
              "&::before": {
                content: '"→"',
                marginRight: "8px",
                color: theme.palette.text.secondary,
              },
              "&:last-child": {
                mb: 0,
              },
              "& p": {
                m: 0,
                display: "inline",
                lineHeight: "inherit",
              },
              "& strong": {
                fontWeight: 600,
                color: "inherit", // Keep default text color
              },
              "& code": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.08)"
                    : "rgba(0, 0, 0, 0.06)",
                padding: "2px 4px",
                borderRadius: "3px",
                fontSize: "0.9em",
                fontFamily: "Monaco, 'Cascadia Code', 'Roboto Mono', monospace",
                color: "inherit", // Keep default text color
                fontWeight: 500,
              },
            },
          }}
        >
          {experience.points.map((point, index) => (
            <li key={`${experience.company}-point-${index}`}>
              <ReactMarkdown
                components={{
                  p: ({ children }) => <span>{children}</span>,
                }}
              >
                {point}
              </ReactMarkdown>
            </li>
          ))}
        </Box>
      </Box>
    </Box>
  );
});

ExperienceCard.displayName = "ExperienceCard";

export default ExperienceCard;
