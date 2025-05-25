import { Box, Typography, Link, useTheme, IconButton } from "@mui/material";
import { useLocation } from "react-router-dom";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

interface NavbarProps {
  toggleColorMode: () => void;
}

const Navbar = ({ toggleColorMode }: NavbarProps) => {
  const theme = useTheme();
  const location = useLocation();

  return (
    // @ts-ignore -- Complex type inference issue with MUI sx prop
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 4,
      }}
    >
      <Box>
        <Link
          href="/"
          sx={{
            textDecoration: "none",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontFamily: "'Pacifico', 'Brush Script MT', cursive",
              color: "#36684c",
              letterSpacing: "2px",
            }}
          >
            Zekarias
          </Typography>
        </Link>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          "& a": {
            color: "inherit",
            textDecoration: "none",
            fontSize: "0.9rem",
            letterSpacing: "0.5px",
            opacity: 0.8,
            transition: "opacity 0.2s ease",
            "&:hover": {
              textDecoration: "underline",
              opacity: 1,
            },
          },
        }}
      >
        <Link
          href="/experience"
          sx={{
            ...(location.pathname === "/experience" && {
              borderBottom: `2px solid ${theme.palette.text.primary}`,
              paddingBottom: "2px",
              opacity: "1 !important",
            }),
          }}
        >
          Experience
        </Link>
        <Link
          href="/notes"
          sx={{
            ...(location.pathname === "/notes" && {
              borderBottom: `2px solid ${theme.palette.text.primary}`,
              paddingBottom: "2px",
              opacity: "1 !important",
            }),
          }}
        >
          Notes
        </Link>
        <IconButton
          sx={{ opacity: 0.6, "&:hover": { opacity: 0.9 } }}
          onClick={toggleColorMode}
          color="inherit"
          size="small"
        >
          {theme.palette.mode === "dark" ? (
            <Brightness7Icon fontSize="small" />
          ) : (
            <Brightness4Icon fontSize="small" />
          )}
        </IconButton>
      </Box>
    </Box>
  );
};

export default Navbar;
