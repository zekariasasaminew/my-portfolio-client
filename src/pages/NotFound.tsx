import { Box, Link, Typography } from "@mui/material";
import Navbar from "../components/Navbar";

const NotFound = () => (
  <Box
    component="main"
    sx={{
      minHeight: "100vh",
      maxWidth: "1200px",
      margin: "0 auto",
      padding: { xs: "2rem", md: "4rem" },
      position: "relative",
      zIndex: 2,
    }}
  >
    <Navbar />
    <Box sx={{ mt: { xs: 8, md: 12 }, textAlign: "center" }}>
      <Typography component="h1" variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        404
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        nothing lives at this address.
      </Typography>
      <Link href="/" sx={{ color: "#7fd8a6", fontWeight: 600 }}>
        back home
      </Link>
    </Box>
  </Box>
);

export default NotFound;
