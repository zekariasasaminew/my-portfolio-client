export interface Project {
  name: string;
  description: string;
  language: string;
  tags: string[];
  stars?: number;
  forks?: number;
  githubUrl: string;
  liveUrl?: string;
  npmUrl?: string;
}

export interface OpenSourceContribution {
  name: string;
  repo: string;
  description: string;
  language: string;
  tags: string[];
  githubUrl: string;
}
