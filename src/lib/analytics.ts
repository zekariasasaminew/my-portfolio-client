const VISITOR_ID_KEY = "analytics_visitor_id";
const SESSION_ID_KEY = "analytics_session_id";
const SESSION_STARTED_KEY = "analytics_session_started";

function getVisitorId(): string {
  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
}

function getSessionId(): string {
  let id = sessionStorage.getItem(SESSION_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_ID_KEY, id);
  }
  return id;
}

function isNewSession(): boolean {
  if (sessionStorage.getItem(SESSION_STARTED_KEY)) return false;
  sessionStorage.setItem(SESSION_STARTED_KEY, "1");
  return true;
}

function send(payload: Record<string, unknown>) {
  try {
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify(payload),
    }).catch(() => {});
  } catch {
    // Analytics must never break the visitor's experience.
  }
}

export function trackPageview(path: string) {
  send({
    type: "pageview",
    path,
    sessionId: getSessionId(),
    visitorId: getVisitorId(),
    referrer: document.referrer,
    isNewSession: isNewSession(),
  });
}

export function trackClick(label: string) {
  send({ type: "click", label });
}

let pageEnteredAt = Date.now();

export function markPageEntered() {
  pageEnteredAt = Date.now();
}

export function trackSessionEnd(path: string) {
  send({
    type: "session_end",
    path,
    sessionId: getSessionId(),
    duration: Date.now() - pageEnteredAt,
  });
}
