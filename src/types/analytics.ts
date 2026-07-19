export interface VisitEntry {
  visitorId: string;
  path: string;
  country: string;
  city: string;
  referrer: string;
  userAgent: string;
  timestamp: number;
}

export interface SessionEntry {
  sessionId: string;
  path: string;
  duration: number;
  timestamp: number;
}

export interface ChatQuestionEntry {
  question: string;
  timestamp: number;
}

export interface AnalyticsData {
  pageviews: Record<string, number>;
  clicks: Record<string, number>;
  sessions: SessionEntry[];
  visits: VisitEntry[];
  chatQuestions: ChatQuestionEntry[];
}
