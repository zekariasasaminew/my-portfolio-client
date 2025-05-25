import { Box, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import ExperienceCard from "../components/ExperienceCard";
import { experiences } from "../data/experiences";

interface ExperienceProps {
  toggleColorMode: () => void;
}

const Experience = ({ toggleColorMode }: ExperienceProps) => {
  const theme = useTheme();

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      sx={{
        minHeight: "100vh",
        maxWidth: "650px",
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
        <Typography
          variant="h6"
          sx={{
            mb: 4,
            fontWeight: 500,
          }}
        >
          experience
        </Typography>

        {experiences.map((experience, index) => (
          <ExperienceCard key={index} experience={experience} />
        ))}
      </Box>
    </Box>
  );
};

export default Experience;
