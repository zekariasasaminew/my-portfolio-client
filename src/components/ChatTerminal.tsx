import { useState, useRef, useEffect } from "react";
import { Box, Drawer, Typography, IconButton, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";

interface ChatTerminalProps {
  open: boolean;
  onClose: () => void;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "What did you build at John Deere?",
  "Tell me about CampusEx",
  "What's your open source track record?",
  "Are you looking for new-grad roles?",
];

const MAX_MESSAGE_LENGTH = 500;

const linkify = (text: string) => {
  const urlPattern = /(https?:\/\/[^\s)]+)/g;
  const parts = text.split(urlPattern);
  return parts.map((part, i) =>
    urlPattern.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "inherit", textDecoration: "underline" }}
      >
        {part}
      </a>
    ) : (
      <span key={i}>{part}</span>
    )
  );
};

const ChatTerminal = ({ open, onClose }: ChatTerminalProps) => {
  const theme = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    transcriptRef.current?.scrollTo({
      top: transcriptRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length > MAX_MESSAGE_LENGTH || isStreaming) return;

    setError(null);
    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(nextMessages);
    setInput("");
    setIsStreaming(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: nextMessages.slice(-6),
        }),
      });

      if (response.status === 429) {
        setError(
          "I'm getting a lot of questions today — try again later, or just email me."
        );
        setIsStreaming(false);
        return;
      }

      if (!response.ok || !response.body) {
        throw new Error("Request failed");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: accumulated,
          };
          return updated;
        });
      }
    } catch {
      setError("Something went wrong. Try again, or email me directly.");
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 420 },
          backgroundColor: theme.palette.background.paper,
          backgroundImage: "none",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          fontFamily:
            'ui-monospace, "JetBrains Mono", "Fira Code", monospace',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 1.5,
            borderBottom: `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontFamily: "inherit", color: theme.palette.text.secondary }}
          >
            zek@portfolio:~$ ask
          </Typography>
          <IconButton size="small" onClick={onClose} aria-label="Close chat">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Transcript */}
        <Box
          ref={transcriptRef}
          aria-live="polite"
          sx={{
            flex: 1,
            overflowY: "auto",
            px: 2,
            py: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {messages.length === 0 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontFamily: "inherit",
                  mb: 1,
                }}
              >
                Ask me anything about Zekarias — his experience, projects, or
                open source work.
              </Typography>
              {SUGGESTED_QUESTIONS.map((q) => (
                <Box
                  key={q}
                  component="button"
                  onClick={() => sendMessage(q)}
                  sx={{
                    textAlign: "left",
                    background: "none",
                    border: `1px solid ${alpha(theme.palette.text.primary, 0.15)}`,
                    borderRadius: 1,
                    px: 1.5,
                    py: 1,
                    fontFamily: "inherit",
                    fontSize: "0.85rem",
                    color: theme.palette.text.primary,
                    cursor: "pointer",
                    transition: "border-color 0.2s ease",
                    "&:hover": {
                      borderColor: alpha(theme.palette.text.primary, 0.35),
                    },
                  }}
                >
                  {q}
                </Box>
              ))}
            </Box>
          )}

          {messages.map((msg, i) => (
            <Box key={i}>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  color: theme.palette.text.secondary,
                  fontFamily: "inherit",
                  mb: 0.5,
                }}
              >
                {msg.role === "user" ? "you>" : "zek>"}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "inherit",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                }}
              >
                {linkify(msg.content)}
                {msg.role === "assistant" &&
                  isStreaming &&
                  i === messages.length - 1 && (
                    <Box
                      component="span"
                      sx={{
                        display: "inline-block",
                        width: "0.5em",
                        height: "1em",
                        ml: 0.5,
                        verticalAlign: "text-bottom",
                        backgroundColor: theme.palette.text.primary,
                        animation: "blink 1s step-start infinite",
                        "@keyframes blink": {
                          "50%": { opacity: 0 },
                        },
                      }}
                    />
                  )}
              </Typography>
            </Box>
          ))}

          {error && (
            <Box
              role="alert"
              sx={{
                border: `1px solid ${alpha(theme.palette.error.main, 0.4)}`,
                borderRadius: 1,
                px: 1.5,
                py: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontFamily: "inherit", color: theme.palette.error.main }}
              >
                {error}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Input */}
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 2,
            py: 1.5,
            borderTop: `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,
          }}
        >
          <Typography
            component="span"
            sx={{ fontFamily: "inherit", color: theme.palette.text.secondary }}
          >
            &gt;
          </Typography>
          <Box
            component="input"
            ref={inputRef}
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInput(e.target.value)
            }
            disabled={isStreaming}
            maxLength={MAX_MESSAGE_LENGTH}
            placeholder="Ask a question…"
            aria-label="Ask a question about Zekarias"
            sx={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              fontFamily: "inherit",
              fontSize: "0.9rem",
              color: theme.palette.text.primary,
              "&::placeholder": { color: theme.palette.text.secondary },
            }}
          />
        </Box>
      </Box>
    </Drawer>
  );
};

export default ChatTerminal;
