import { Box, Typography, Link, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import StarIcon from "@mui/icons-material/Star";
import ForkRightIcon from "@mui/icons-material/ForkRight";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { projects, openSourceContributions } from "../data/projects";
import type { Project, OpenSourceContribution } from "../types/project";

interface ProjectsProps {
  toggleColorMode: () => void;
}

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
        border: `1px solid ${alpha(theme.palette.text.primary, 0.15)}`,
        color: theme.palette.text.secondary,
        lineHeight: 1.6,
      }}
    >
      {label}
    </Box>
  );
};

const ProjectCard = ({ project }: { project: Project }) => {
  const theme = useTheme();
  return (
    <Box
      component={motion.div}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      sx={{
        p: 2.5,
        border: `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,
        borderRadius: 1.5,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        transition: "border-color 0.2s ease",
        "&:hover": {
          borderColor: alpha(theme.palette.text.primary, 0.25),
        },
      }}
    >
      {/* Header: name + stats */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Typography
          variant="body1"
          sx={{ fontWeight: 600, fontFamily: "monospace", letterSpacing: "-0.3px" }}
        >
          {project.name}
        </Typography>
        {(project.stars !== undefined || project.forks !== undefined) && (
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
            {project.stars !== undefined && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.4,
                  color: "text.secondary",
                }}
              >
                <StarIcon sx={{ fontSize: "0.85rem" }} />
                <Typography variant="caption">{project.stars}</Typography>
              </Box>
            )}
            {project.forks !== undefined && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.4,
                  color: "text.secondary",
                }}
              >
                <ForkRightIcon sx={{ fontSize: "0.85rem" }} />
                <Typography variant="caption">{project.forks}</Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Description */}
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ lineHeight: 1.6, flex: 1 }}
      >
        {project.description}
      </Typography>

      {/* Tags */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
        {project.tags.map((tag) => (
          <Tag key={tag} label={tag} />
        ))}
      </Box>

      {/* Links */}
      <Box sx={{ display: "flex", gap: 2, mt: 0.5 }}>
        <Link
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            color: "text.secondary",
            textDecoration: "none",
            fontSize: "0.8rem",
            opacity: 0.85,
            "&:hover": { opacity: 1, textDecoration: "underline" },
          }}
        >
          GitHub
          <OpenInNewIcon sx={{ fontSize: "0.75rem" }} />
        </Link>
        {project.liveUrl && (
          <Link
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "text.secondary",
              textDecoration: "none",
              fontSize: "0.8rem",
              opacity: 0.85,
              "&:hover": { opacity: 1, textDecoration: "underline" },
            }}
          >
            Live
            <OpenInNewIcon sx={{ fontSize: "0.75rem" }} />
          </Link>
        )}
        {project.npmUrl && (
          <Link
            href={project.npmUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "text.secondary",
              textDecoration: "none",
              fontSize: "0.8rem",
              opacity: 0.85,
              "&:hover": { opacity: 1, textDecoration: "underline" },
            }}
          >
            npm
            <OpenInNewIcon sx={{ fontSize: "0.75rem" }} />
          </Link>
        )}
      </Box>
    </Box>
  );
};

const OSSRow = ({ contrib }: { contrib: OpenSourceContribution }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 1.5,
        py: 2,
        borderBottom: `1px solid ${alpha(theme.palette.text.primary, 0.07)}`,
        "&:last-child": { borderBottom: "none" },
      }}
    >
      <Typography
        component="span"
        sx={{ color: "text.secondary", fontWeight: 600, fontSize: "1.1rem", lineHeight: 1.8, mt: 0.1 }}
      >
        →
      </Typography>
      <Box sx={{ flex: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
            mb: 0.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {contrib.name}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontFamily: "monospace", opacity: 0.6 }}
            >
              {contrib.repo}
            </Typography>
          </Box>
          <Link
            href={contrib.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "text.secondary",
              textDecoration: "none",
              fontSize: "0.8rem",
              opacity: 0.8,
              "&:hover": { opacity: 1, textDecoration: "underline" },
            }}
          >
            GitHub
            <OpenInNewIcon sx={{ fontSize: "0.75rem" }} />
          </Link>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, lineHeight: 1.5 }}>
          {contrib.description}
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
          {contrib.tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

const Projects = ({ toggleColorMode }: ProjectsProps) => {
  const theme = useTheme();

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      sx={{
        minHeight: "100vh",
        maxWidth: "900px",
        margin: "0 auto",
        padding: { xs: "2rem", md: "4rem" },
        display: "flex",
        flexDirection: "column",
        color: theme.palette.text.primary,
        position: "relative",
        zIndex: 1,
      }}
    >
      <Navbar toggleColorMode={toggleColorMode} />

      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" sx={{ mb: 4, fontWeight: 500 }}>
          projects
        </Typography>

        {/* My projects */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2.5, textTransform: "uppercase", letterSpacing: "1px", fontSize: "0.7rem" }}
          >
            my work
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            {projects.map((project, idx) => (
              <ProjectCard key={idx} project={project} />
            ))}
          </Box>
        </Box>

        {/* Open source */}
        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, textTransform: "uppercase", letterSpacing: "1px", fontSize: "0.7rem" }}
          >
            open source contributions
          </Typography>
          <Box>
            {openSourceContributions.map((contrib, idx) => (
              <OSSRow key={idx} contrib={contrib} />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Projects;
