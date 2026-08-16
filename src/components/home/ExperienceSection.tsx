import { useState } from "react";
import { Box, Typography, Link, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CodeIcon from "@mui/icons-material/Code";
import ScienceIcon from "@mui/icons-material/Science";
import WebIcon from "@mui/icons-material/Web";
import SchoolIcon from "@mui/icons-material/School";
import GitHubIcon from "@mui/icons-material/GitHub";
import type { Experience } from "../../types/experience";
import { experiences } from "../../data/experiences";
import Tag from "../Tag";

const icons = {
  code: CodeIcon,
  science: ScienceIcon,
  web: WebIcon,
  school: SchoolIcon,
} as const;

const CompanyLogo = ({ exp, size }: { exp: Experience; size: number }) => {
  const theme = useTheme();
  const [failed, setFailed] = useState(false);
  const accent = theme.palette.mode === "dark" ? exp.themeColor.dark : exp.themeColor.light;

  if (exp.company === "Open Source") {
    return <GitHubIcon sx={{ fontSize: `${size}px`, color: accent, flexShrink: 0 }} />;
  }

  if (exp.logoSrc && !failed) {
    const img = (
      <Box
        component="img"
        src={exp.logoSrc}
        alt={`${exp.company} logo`}
        onError={() => setFailed(true)}
        sx={
          exp.logoNeedsLightBg
            ? { width: "72%", height: "72%" }
            : { width: `${size}px`, height: `${size}px` }
        }
      />
    );

    if (!exp.logoNeedsLightBg) return img;

    return (
      <Box
        sx={{
          width: `${size}px`,
          height: `${size}px`,
          flexShrink: 0,
          borderRadius: "4px",
          bgcolor: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {img}
      </Box>
    );
  }

  if (exp.logoIcon && !failed) {
    return (
      <Box
        component="img"
        src={`https://api.iconify.design/${exp.logoIcon}.svg`}
        alt={`${exp.company} logo`}
        onError={() => setFailed(true)}
        sx={{ width: `${size}px`, height: `${size}px`, flexShrink: 0 }}
      />
    );
  }

  if (exp.logoDomain && !failed) {
    return (
      <Box
        component="img"
        src={`https://icons.duckduckgo.com/ip3/${exp.logoDomain}.ico`}
        alt={`${exp.company} logo`}
        onError={() => setFailed(true)}
        sx={{ width: `${size}px`, height: `${size}px`, flexShrink: 0, borderRadius: "3px" }}
      />
    );
  }

  const Icon = icons[exp.iconType];
  return <Icon sx={{ fontSize: `${size}px`, color: accent, flexShrink: 0 }} />;
};

const ExperienceSection = () => {
  const theme = useTheme();
  const [selected, setSelected] = useState(0);
  const experience = experiences[selected];
  const accentFor = (exp: (typeof experiences)[number]) =>
    theme.palette.mode === "dark" ? exp.themeColor.dark : exp.themeColor.light;

  return (
    <Box component="section" id="experience" sx={{ scrollMarginTop: "5rem", mb: { xs: 8, md: 10 } }}>
      <Typography component="h2" variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        experience
      </Typography>

      <Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", md: "row" } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "row", md: "column" },
            gap: 1,
            overflowX: { xs: "auto", md: "visible" },
            width: { xs: "100%", md: "260px" },
            flexShrink: 0,
          }}
        >
          {experiences.map((exp, idx) => {
            const active = idx === selected;
            return (
              <Box
                key={exp.company}
                component="button"
                onClick={() => setSelected(idx)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  textAlign: "left",
                  px: 1.5,
                  py: 1.25,
                  minWidth: { xs: "180px", md: "auto" },
                  border: `1px solid ${
                    active ? accentFor(exp) : alpha(theme.palette.text.primary, 0.12)
                  }`,
                  borderRadius: 1.5,
                  bgcolor: active ? alpha(accentFor(exp), 0.08) : "transparent",
                  cursor: "pointer",
                  font: "inherit",
                  color: "inherit",
                  transition: "border-color 0.2s ease, background-color 0.2s ease",
                }}
              >
                <CompanyLogo exp={exp} size={20} />
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, lineHeight: 1.3, whiteSpace: "nowrap" }}
                  >
                    {exp.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: theme.palette.text.secondary, whiteSpace: "nowrap" }}
                  >
                    {exp.company}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>

        <Box
          sx={{
            flex: 1,
            p: { xs: 2.5, md: 3 },
            border: `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,
            borderRadius: 1.5,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
            {experience.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary, mb: 1.5 }}
          >
            {experience.companyUrl ? (
              <Link
                href={experience.companyUrl}
                target="_blank"
                rel="noopener"
                sx={{ color: accentFor(experience), fontWeight: 600, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
              >
                {experience.company}
              </Link>
            ) : (
              experience.company
            )}{" "}
            · {experience.location}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 2.5 }}>
            <CalendarTodayIcon sx={{ fontSize: "0.85rem", color: theme.palette.text.secondary }} />
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              {experience.startDate} – {experience.endDate}
            </Typography>
          </Box>

          {experience.techTags && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: experience.detailLink ? 2.5 : 0 }}>
              {experience.techTags.map((tag) => (
                <Tag key={tag} label={tag} />
              ))}
            </Box>
          )}

          {experience.detailLink && (
            <Link
              href={experience.detailLink}
              sx={{
                display: "inline-block",
                fontSize: "0.9rem",
                fontWeight: 500,
                color: accentFor(experience),
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Read the full story →
            </Link>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ExperienceSection;
