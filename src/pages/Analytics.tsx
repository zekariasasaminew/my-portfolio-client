import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import type { AnalyticsData } from "../types/analytics";

interface Props {
  toggleColorMode: () => void;
}

const ACCENT = "#0a8f4f";
const ACCENT_DARK = "#7fd8a6";

function StatTile({ label, value }: { label: string; value: string | number }) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        flex: "1 1 160px",
        p: 2,
        border: `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,
        borderRadius: 1.5,
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}

function BarList({
  title,
  data,
}: {
  title: string;
  data: Record<string, number>;
}) {
  const theme = useTheme();
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const max = entries.length ? entries[0][1] : 1;
  const accent = theme.palette.mode === "dark" ? ACCENT_DARK : ACCENT;

  return (
    <Box sx={{ mb: 5 }}>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 2, textTransform: "uppercase", letterSpacing: "1px", fontSize: "0.7rem" }}
      >
        {title}
      </Typography>
      {entries.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.6 }}>
          No data yet
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {entries.map(([key, count]) => (
            <Box key={key} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography
                variant="body2"
                sx={{ width: 220, flexShrink: 0, fontFamily: "monospace", fontSize: "0.8rem" }}
                noWrap
                title={key}
              >
                {key}
              </Typography>
              <Box sx={{ flex: 1, bgcolor: alpha(theme.palette.text.primary, 0.06), borderRadius: 0.5 }}>
                <Box
                  sx={{
                    width: `${(count / max) * 100}%`,
                    minWidth: 4,
                    height: 16,
                    bgcolor: accent,
                    borderRadius: 0.5,
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ width: 40, textAlign: "right", flexShrink: 0 }}>
                {count}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

function median(values: number[]): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

const Analytics = ({ toggleColorMode }: Props) => {
  const theme = useTheme();
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyticsData | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/analytics/data");
      if (res.ok) {
        setData((await res.json()) as AnalyticsData);
        setAuthenticated(true);
      }
    } catch {
      // Falls through to the password prompt below.
    }
    setCheckingSession(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial session check on mount, the standard fetch-on-mount pattern
    void fetchData();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const res = await fetch("/api/analytics/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        await fetchData();
        return;
      }
    } catch {
      // Falls through to the error message below.
    }
    setAuthError("Wrong password");
  };

  if (checkingSession) {
    return null;
  }

  if (!authenticated || !data) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{ display: "flex", flexDirection: "column", gap: 2, width: 280 }}
        >
          <TextField
            type="password"
            label="Password"
            size="small"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!authError}
            helperText={authError ?? " "}
          />
          <Button type="submit" variant="outlined">
            Enter
          </Button>
        </Box>
      </Box>
    );
  }

  const durations = data.sessions.map((s) => s.duration).filter((d) => d > 0);
  const avgDurationSec = durations.length
    ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length / 1000)
    : 0;
  const medianDurationSec = Math.round(median(durations) / 1000);
  const totalPageviews = Object.values(data.pageviews).reduce((a, b) => a + b, 0);

  const countryCounts: Record<string, number> = {};
  for (const v of data.visits) {
    countryCounts[v.country || "unknown"] = (countryCounts[v.country || "unknown"] ?? 0) + 1;
  }
  const referrerCounts: Record<string, number> = {};
  for (const v of data.visits) {
    const ref = v.referrer && v.referrer !== "" ? v.referrer : "direct";
    referrerCounts[ref] = (referrerCounts[ref] ?? 0) + 1;
  }

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      sx={{
        minHeight: "100vh",
        maxWidth: "900px",
        margin: "0 auto",
        padding: { xs: "2rem", md: "4rem" },
        color: theme.palette.text.primary,
      }}
    >
      <Navbar toggleColorMode={toggleColorMode} />

      <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>
        analytics (last 30 days)
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 5 }}>
        <StatTile label="Pageviews" value={totalPageviews} />
        <StatTile label="Unique visits logged" value={data.visits.length} />
        <StatTile label="Avg time on page" value={`${avgDurationSec}s`} />
        <StatTile label="Median time on page" value={`${medianDurationSec}s`} />
        <StatTile label="Chatbot questions" value={data.chatQuestions.length} />
      </Box>

      <BarList title="Top pages" data={data.pageviews} />
      <BarList title="Button clicks" data={data.clicks} />
      <BarList title="Visitor countries" data={countryCounts} />
      <BarList title="Referrers" data={referrerCounts} />

      <Box sx={{ mb: 5 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, textTransform: "uppercase", letterSpacing: "1px", fontSize: "0.7rem" }}
        >
          Recent chatbot questions
        </Typography>
        {data.chatQuestions.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.6 }}>
            No data yet
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {data.chatQuestions.slice(0, 50).map((q, i) => (
              <Box
                key={i}
                sx={{
                  p: 1.25,
                  border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2">{q.question}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(q.timestamp).toLocaleString()}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <Box sx={{ mb: 5 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, textTransform: "uppercase", letterSpacing: "1px", fontSize: "0.7rem" }}
        >
          Recent visits
        </Typography>
        <Box sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>Page</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Referrer</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.visits.slice(0, 50).map((v, i) => (
                <TableRow key={i}>
                  <TableCell>{new Date(v.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{v.path}</TableCell>
                  <TableCell>
                    {[v.city, v.country].filter((s) => s && s !== "unknown").join(", ") || "unknown"}
                  </TableCell>
                  <TableCell>{v.referrer || "direct"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
};

export default Analytics;
