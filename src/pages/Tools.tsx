import { Box, Typography, Link, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LockIcon from "@mui/icons-material/Lock";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { tools } from "../data/tools";
import type { Tool } from "../types/tool";

interface ToolsProps {
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

const ToolCard = ({ tool }: { tool: Tool }) => {
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
      {/* Header: name + client-side badge */}
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
          {tool.name}
        </Typography>
        {tool.clientSideOnly && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.4,
              color: "text.secondary",
            }}
            title="Runs entirely in your browser — your data never leaves your machine"
          >
            <LockIcon sx={{ fontSize: "0.8rem" }} />
            <Typography variant="caption">client-side</Typography>
          </Box>
        )}
      </Box>

      {/* Description */}
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ lineHeight: 1.6, flex: 1 }}
      >
        {tool.description}
      </Typography>

      {/* Setup */}
      <Box
        sx={{
          fontFamily: "monospace",
          fontSize: "0.78rem",
          color: "text.secondary",
          bgcolor: alpha(theme.palette.text.primary, 0.05),
          border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
          borderRadius: 1,
          px: 1.25,
          py: 0.75,
          overflowX: "auto",
          whiteSpace: "nowrap",
        }}
      >
        $ {tool.setup}
      </Box>

      {/* Tags */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
        {tool.stack.map((tag) => (
          <Tag key={tag} label={tag} />
        ))}
      </Box>

      {/* Links */}
      <Box sx={{ display: "flex", gap: 2, mt: 0.5 }}>
        <Link
          href={tool.githubUrl}
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
        {tool.liveUrl && (
          <Link
            href={tool.liveUrl}
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
        {tool.docsUrl && (
          <Link
            href={tool.docsUrl}
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
            Docs
            <OpenInNewIcon sx={{ fontSize: "0.75rem" }} />
          </Link>
        )}
      </Box>
    </Box>
  );
};

const Tools = ({ toggleColorMode }: ToolsProps) => {
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
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
          tools
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 4, lineHeight: 1.6, maxWidth: "600px" }}
        >
          Small things I built for myself and use regularly, cleaned up
          enough for anyone to grab and run.
        </Typography>

        {tools.length > 0 ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            {tools.map((tool, idx) => (
              <ToolCard key={idx} tool={tool} />
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.7 }}>
            Nothing published here yet — check back soon.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Tools;
