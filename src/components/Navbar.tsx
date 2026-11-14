import { useState } from "react";
import {
  Box,
  Typography,
  Link,
  useTheme,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";

const NAV_LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#experience", label: "Experience" },
  { href: "/#projects", label: "Projects" },
  { href: "/#skills", label: "Skills" },
  { href: "/notes", label: "Notes", page: true },
];

const Navbar = () => {
  const theme = useTheme();
  const location = useLocation();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  return (
    <Box
      component="header"
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
            component="p"
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

      <Box
        component="nav"
        aria-label="Main"
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
        {NAV_LINKS.map((link) =>
          link.page ? (
            <Box key={link.href} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box aria-hidden sx={{ width: "1px", height: "1.1rem", bgcolor: "text.secondary", opacity: 0.4, mx: 0.5 }} />
              <Link
                href={link.href}
                aria-current={location.pathname === link.href ? "page" : undefined}
                sx={{
                  px: 1.25,
                  py: 0.25,
                  borderRadius: 999,
                  border: `1px solid ${theme.palette.text.primary}`,
                  opacity: "1 !important",
                  "&:hover": { textDecoration: "none !important", bgcolor: theme.palette.text.primary, color: theme.palette.background.default },
                  ...(location.pathname === link.href && {
                    bgcolor: theme.palette.text.primary,
                    color: `${theme.palette.background.default} !important`,
                  }),
                }}
              >
                {link.label.toLowerCase()} →
              </Link>
            </Box>
          ) : (
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
          ),
        )}
      </Box>

      <Box
        component="nav"
        aria-label="Main"
        sx={{
          display: { xs: "flex", sm: "none" },
          alignItems: "center",
          gap: 0.5,
        }}
      >
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
          {NAV_LINKS.flatMap((link) => [
            ...(link.page ? [<Divider key={`${link.href}-divider`} />] : []),
            <MenuItem
              key={link.href}
              component="a"
              href={link.href}
              selected={location.pathname === link.href}
              onClick={() => setMenuAnchor(null)}
            >
              {link.page ? `${link.label} →` : link.label}
            </MenuItem>,
          ])}
        </Menu>
      </Box>
    </Box>
  );
};

export default Navbar;
