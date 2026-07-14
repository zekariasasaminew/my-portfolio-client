import { useState, useRef, useEffect } from "react";
import { Box, Typography } from "@mui/material";

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

// Fixed-dark palette, independent of the site's light/dark toggle - a real
// terminal doesn't switch to light mode.
const TERM = {
  bg: "#0c0e12",
  titlebar: "#14161b",
  border: "#2a2d33",
  fg: "#e8e6e1",
  fgDim: "#8b8f98",
  amber: "#d4a24e",
  mint: "#6fd8a0",
  red: "#c9605a",
};

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
        style={{ color: TERM.mint, textDecoration: "underline" }}
      >
        {part}
      </a>
    ) : (
      <span key={i}>{part}</span>
    )
  );
};

const ChatTerminal = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
          history: messages.slice(-16),
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
    <Box
      sx={{
        background: TERM.bg,
        border: `1px solid ${TERM.border}`,
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 20px 60px -20px rgba(0,0,0,0.55)",
      }}
    >
      {/* Title bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          px: "0.9rem",
          py: "0.7rem",
          background: TERM.titlebar,
          borderBottom: `1px solid ${TERM.border}`,
        }}
      >
        <Box sx={{ width: 11, height: 11, borderRadius: "50%", background: TERM.red }} />
        <Box sx={{ width: 11, height: 11, borderRadius: "50%", background: TERM.amber }} />
        <Box sx={{ width: 11, height: 11, borderRadius: "50%", background: TERM.mint }} />
        <Typography
          sx={{
            m: "0 auto",
            transform: "translateX(-18px)",
            fontFamily: "inherit",
            fontSize: "0.78rem",
            color: TERM.fgDim,
          }}
        >
          zek@portfolio: ~
        </Typography>
      </Box>

      {/* Body */}
      <Box
        sx={{
          px: { xs: "1rem", sm: "1.3rem" },
          pt: "1.1rem",
          pb: "0.9rem",
          fontFamily:
            'ui-monospace, "JetBrains Mono", "Fira Code", monospace',
          fontSize: "0.88rem",
          lineHeight: 1.65,
          color: TERM.fg,
          minHeight: 280,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          ref={transcriptRef}
          aria-live="polite"
          sx={{ flex: 1, overflowY: "auto", maxHeight: 360 }}
        >
          {messages.length === 0 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <Typography
                sx={{
                  color: TERM.fgDim,
                  fontFamily: "inherit",
                  fontSize: "inherit",
                  mb: "0.4rem",
                }}
              >
                ask anything about zekarias — his experience, projects, or open
                source work.
              </Typography>
              {SUGGESTED_QUESTIONS.map((q) => (
                <Box
                  key={q}
                  component="button"
                  onClick={() => sendMessage(q)}
                  sx={{
                    textAlign: "left",
                    background: "none",
                    border: `1px solid ${TERM.border}`,
                    borderRadius: "6px",
                    px: "0.8rem",
                    py: "0.55rem",
                    fontFamily: "inherit",
                    fontSize: "0.83rem",
                    color: TERM.fg,
                    cursor: "pointer",
                    transition: "border-color 0.15s ease, background 0.15s ease",
                    "&:hover": {
                      borderColor: TERM.amber,
                      background: "rgba(212,162,78,0.07)",
                    },
                  }}
                >
                  {q}
                </Box>
              ))}
            </Box>
          )}

          {messages.map((msg, i) => (
            <Box key={i} sx={{ mb: "0.5rem" }}>
              <Box component="span" sx={{ color: msg.role === "user" ? TERM.mint : TERM.amber }}>
                {msg.role === "user" ? "you>" : "zek>"}
              </Box>{" "}
              <Box
                component="span"
                sx={{ whiteSpace: "pre-wrap" }}
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
                        ml: "2px",
                        verticalAlign: "text-bottom",
                        backgroundColor: TERM.amber,
                        animation: "blink 1s step-start infinite",
                        "@media (prefers-reduced-motion: reduce)": {
                          animation: "none",
                        },
                        "@keyframes blink": { "50%": { opacity: 0 } },
                      }}
                    />
                  )}
              </Box>
            </Box>
          ))}

          {error && (
            <Box
              role="alert"
              sx={{
                border: `1px solid ${TERM.red}66`,
                borderRadius: "6px",
                px: "0.8rem",
                py: "0.6rem",
                mt: "0.5rem",
              }}
            >
              <Box component="span" sx={{ color: TERM.red }}>
                {error}
              </Box>
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
            gap: "0.6rem",
            mt: "auto",
            pt: "0.9rem",
            borderTop: `1px solid ${TERM.border}`,
          }}
        >
          <Box component="span" sx={{ color: TERM.fgDim }}>
            &gt;
          </Box>
          <Box
            component="input"
            ref={inputRef}
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInput(e.target.value)
            }
            disabled={isStreaming}
            maxLength={MAX_MESSAGE_LENGTH}
            placeholder="ask a question…"
            aria-label="Ask a question about Zekarias"
            sx={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              fontFamily: "inherit",
              fontSize: "inherit",
              color: TERM.fg,
              "&::placeholder": { color: TERM.fgDim },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ChatTerminal;
