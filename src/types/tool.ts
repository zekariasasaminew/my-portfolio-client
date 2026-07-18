export interface Tool {
  name: string;
  description: string;
  setup: string;
  stack: string[];
  githubUrl: string;
  liveUrl?: string;
  docsUrl?: string;
  clientSideOnly?: boolean;
}
