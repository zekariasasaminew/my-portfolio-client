import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Box, Typography, Link, Stack } from "@mui/material";
import { ENDPOINTS } from "../config";

interface SpotifyTrack {
  name: string;
  artist: string;
  album: string;
  albumArt: string;
  playedAt: string;
  spotifyUrl: string;
  isPlaying: boolean;
}

export default function SpotifyNowPlaying() {
  const [track, setTrack] = useState<SpotifyTrack | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLastPlayed = async () => {
      try {
        const response = await fetch(ENDPOINTS.LAST_PLAYED, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch track data");
        }
        const data = await response.json();
        setTrack(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch track data"
        );
        console.error("Error fetching track:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLastPlayed();
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          p: 2,
          bgcolor: "background.paper",
          borderRadius: 1,
          boxShadow: 1,
        }}
      >
        <Box sx={{ height: 48, bgcolor: "grey.800", borderRadius: 1, mb: 2 }} />
        <Box
          sx={{
            height: 16,
            bgcolor: "grey.800",
            borderRadius: 1,
            width: "75%",
            mb: 1,
          }}
        />
        <Box
          sx={{
            height: 16,
            bgcolor: "grey.800",
            borderRadius: 1,
            width: "50%",
          }}
        />
      </Box>
    );
  }

  if (error || !track) {
    return null;
  }

  const timeAgo = new Date(track.playedAt).toLocaleString();

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      alignItems="flex-start"
      spacing={2}
    >
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          width: "100%",
          maxWidth: 400,
          p: 2,
          bgcolor: "background.paper",
          borderRadius: 1,
          boxShadow: 1,
          "&:hover": {
            boxShadow: 3,
            transition: "box-shadow 0.3s ease-in-out",
          },
        }}
      >
        <Link
          href={track.spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: "block",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box
              component={motion.img}
              src={track.albumArt}
              alt={`${track.album} cover`}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              sx={{
                width: 64,
                height: 64,
                borderRadius: 1,
                boxShadow: 1,
                flexShrink: 0,
                "&:hover": {
                  boxShadow: 2,
                },
              }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                <Box
                  component="svg"
                  viewBox="0 0 24 24"
                  sx={{
                    width: 16,
                    height: 16,
                    mr: 1,
                    flexShrink: 0,
                    color: track.isPlaying ? "#1DB954" : "text.secondary",
                  }}
                >
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ flexShrink: 0 }}
                >
                  {track.isPlaying ? "Now playing" : "Last played"}
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  "&:hover": {
                    color: "#1DB954",
                  },
                }}
              >
                {track.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {track.artist} • {track.album}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 0.5, display: "block" }}
              >
                {track.isPlaying ? "Playing now" : timeAgo}
              </Typography>
            </Box>
          </Box>
        </Link>
      </Box>
      <Typography
        variant="body2"
        component={motion.p}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        sx={{
          fontStyle: "italic",
          color: "text.secondary",
          flexShrink: 1,
        }}
      >
        (be surprised if it's not Drake)
      </Typography>
    </Stack>
  );
}
