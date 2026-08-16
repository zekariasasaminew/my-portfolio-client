import { useState } from "react";
import {
  Box,
  Typography,
  Link,
  useTheme,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MenuIcon from "@mui/icons-material/Menu";
import { FEATURE_FLAGS } from "../config";

interface NavbarProps {
  toggleColorMode: () => void;
}

const NAV_LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#experience", label: "Experience" },
  { href: "/#projects", label: "Projects" },
  { href: "/#skills", label: "Skills" },
  { href: "/notes", label: "Notes" },
];

const Navbar = ({ toggleColorMode }: NavbarProps) => {
  const theme = useTheme();
  const location = useLocation();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  return (
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
            color: "inherit",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "inherit",
              letterSpacing: "-0.01em",
            }}
          >
            Zekarias Asaminew
          </Typography>
        </Link>
      </Box>

      {/* Desktop nav */}
      <Box
        sx={{
          display: { xs: "none", sm: "flex" },
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
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            sx={{
              ...(location.pathname === link.href && {
                borderBottom: `2px solid ${theme.palette.text.primary}`,
                paddingBottom: "2px",
                opacity: "1 !important",
              }),
            }}
          >
            {link.label.toLowerCase()}
          </Link>
        ))}
        {FEATURE_FLAGS.showThemeToggle && (
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
        )}
      </Box>

      {/* Mobile nav */}
      <Box
        sx={{
          display: { xs: "flex", sm: "none" },
          alignItems: "center",
          gap: 0.5,
        }}
      >
        {FEATURE_FLAGS.showThemeToggle && (
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
        )}
        <IconButton
          aria-label="Open navigation menu"
          onClick={(e) => setMenuAnchor(e.currentTarget)}
          color="inherit"
          size="small"
        >
          <MenuIcon fontSize="small" />
        </IconButton>
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
        >
          {NAV_LINKS.map((link) => (
            <MenuItem
              key={link.href}
              component="a"
              href={link.href}
              selected={location.pathname === link.href}
              onClick={() => setMenuAnchor(null)}
            >
              {link.label}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Box>
  );
};

export default Navbar;
