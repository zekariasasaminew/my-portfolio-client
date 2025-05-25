import { Box, Typography, Link } from "@mui/material";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import Navbar from "../components/Navbar";

interface AboutProps {
  toggleColorMode: () => void;
}

// Define sections and their content
interface Section {
  id: string;
  title: string;
  image: string;
  description: string;
  link?: string;
}

export const aboutSections: Record<string, Section> = {
  projects: {
    id: "projects",
    title: "Fun Side Projects",
    image: "/images/about/projects.png",
    description: " It's a work in progress, but it's a fun project to work on.",
    link: "https://my-gf-to-do-list.vercel.app/",
  },
  lab: {
    id: "lab",
    title: "Inside the Lab",
    image: "/images/about/lab.jpg",
    description: "I am also biochemistry major",
  },
  football: {
    id: "football",
    title: "Football",
    image: "/images/about/football.png",
    description:
      "Football isn't just a sport, it's a way to connect and share moments of joy.",
  },
  tech: {
    id: "tech",
    title: "Tech Journey",
    image: "/images/about/tech2.JPG",
    description:
      "From writing my first line of code to building full-stack applications at John Deere. Passionate about web technologies, automation, and creating intuitive user experiences.",
  },
} as const;

export type SectionId = keyof typeof aboutSections;

const About = ({ toggleColorMode }: AboutProps) => {
  const location = useLocation();
  const sectionRefs = useRef<Record<SectionId, HTMLDivElement | null>>({
    projects: null,
    lab: null,
    football: null,
    tech: null,
    community: null,
  });

  // Scroll to section if hash is present in URL
  useEffect(() => {
    const sectionId = location.hash.slice(1) as SectionId;
    if (sectionId && sectionRefs.current[sectionId]) {
      sectionRefs.current[sectionId]?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      sx={{
        minHeight: "100vh",
        maxWidth: "800px",
        margin: "0 auto",
        padding: { xs: "2rem", md: "4rem" },
        display: "flex",
        flexDirection: "column",
        position: "relative",
        zIndex: 1,
      }}
    >
      <Navbar toggleColorMode={toggleColorMode} />

      {Object.entries(aboutSections).map(([id, section]) => (
        <Box
          key={id}
          ref={(el: HTMLDivElement | null) =>
            (sectionRefs.current[id as SectionId] = el)
          }
          id={id}
          sx={{
            mb: 8,
            scrollMarginTop: "2rem",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 4,
                alignItems: "flex-start",
              }}
            >
              <Box
                component="img"
                src={section.image}
                alt={section.title}
                sx={{
                  width: { xs: "100%", md: "300px" },
                  height: { xs: "200px", md: "200px" },
                  objectFit: "cover",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 2,
                    fontWeight: 500,
                  }}
                >
                  {section.title}
                </Typography>
                <Typography
                  variant="body1"
                  component="div"
                  sx={{
                    lineHeight: 1.8,
                    opacity: 0.9,
                  }}
                >
                  {section.description}
                  {section.link && (
                    <Link
                      href={section.link}
                      target="_blank"
                      rel="noopener"
                      sx={{
                        ml: 1,
                        color: "inherit",
                        textDecoration: "underline",
                        textDecorationColor: "rgba(255, 255, 255, 0.3)",
                        "&:hover": {
                          textDecorationColor: "rgba(255, 255, 255, 0.6)",
                        },
                      }}
                    >
                      View Project
                    </Link>
                  )}
                </Typography>
                {/* Add more content specific to each section here */}
              </Box>
            </Box>
          </motion.div>
        </Box>
      ))}
    </Box>
  );
};

export default About;
