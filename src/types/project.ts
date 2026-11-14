export interface Project {
  name: string;
  description: string;
  language: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  npmUrl?: string;
  pluginUrl?: string;
  postUrl?: string;
}

export interface OpenSourceContribution {
  name: string;
  repo: string;
  description: string;
  language: string;
  tags: string[];
  githubUrl: string;
}
