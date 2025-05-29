import type { Note } from '../types/note';

export const notes: Note[] = [
  {
    id: 1,
    title: 'Syncing GitHub Contributions Across Accounts',
    content: [
      'As a student engineer working on both enterprise and personal projects, I ran into a frustrating limitation: my work at John Deere doesn’t show up on my public GitHub profile. I wanted a way to reflect my daily contributions while respecting privacy and access restrictions.',
      'To work around this, I started learning about Git’s commit structure, author/committer fields, and how to safely replicate activity using `git commit-tree` and `git rebase --root`. I experimented with rewriting commit histories locally, creating non-sensitive dummy repos that mimic my workflow, and using cron jobs to automate the push process. I also looked into GitHub’s API for contribution detection and timestamp alignment.',
      'I haven’t perfected the system yet, but I’m actively testing ways to mirror safe commit metadata without exposing actual work. If anyone has experience with syncing GitHub Enterprise activity to a public profile in a secure and compliant way, I’d love to connect.'
  ],
    createdAt: '2025-05-27',
    updatedAt: '2025-05-27',
    tags: ['#github', '#automation', '#devworkflow'],
  },
  {
    id: 2,
    title: 'Fullstack Learning Through Real Problems',
    content: [
      'I’m currently building a course planner web app from scratch; not just as a coding exercise, but to solve a real student problem I’ve faced myself. The goal is to generate a semester-by-semester plan based on a student’s major, minors, prerequisites, and graduation requirements.',
      'So far, I’ve laid the groundwork: setting up the backend logic to track prerequisites, designing MongoDB schemas for flexible course data, and scaffolding the frontend using React and MUI. The next step is fine-tuning the UI for drag-and-drop scheduling and ensuring that Express auth integrates cleanly across the app.',
      'It’s a work in progress, but it’s already taught me how backend decisions affect frontend experience; and how real user needs can guide architecture. I’m excited to keep iterating and make something truly useful.'
    ],
    createdAt: '2025-05-28',
    updatedAt: '2025-05-28',
    tags: ['#fullstack', '#studentlife', '#react'],
  },
  {
    id: 3,
    title: 'Bringing Redis Into a Clustered World',
    content: [
      'I recently containerized a Redis instance to support local data caching for station and call data; and while my Docker setup was solid, connecting it to the right Kubernetes context gave me trouble.',
      'Eventually, I realized the production environment used port-forwarded access to a Redis cluster, while the local instance lacked routing. The fix was less about code and more about understanding cloud architecture. Every bug is a systems problem in disguise.'
    ],
    createdAt: '2025-05-28',
    updatedAt: '2025-05-28',
    tags: ['#redis', '#docker', '#kubernetes'],
  },
  {
  id: 4,
  title: 'Why I Integrated Spotify into My Website',
  content: [
    'To make my portfolio site more personal and dynamic, I integrated Spotify’s API to show what I’m currently listening to or last played. It’s not just a novelty; it reflects who I am, in real time, and adds an interactive edge to my site.',
    'I already understood how OAuth, token refresh, and REST APIs work; I wasn’t doing this to learn the tech. I just wanted something running on the backend that made my site feel alive. Since I didn’t want a bland portfolio that only lived on the frontend, this was the perfect lightweight feature to showcase API integration and background polling.',
    'Setting it up involved handling authentication securely, accounting for rate limits, and rendering fallback states when no track was playing. It’s a small touch, but one that keeps my portfolio technically interesting and personally expressive.'
  ],
  createdAt: '2025-05-27',
  updatedAt: '2025-05-27',
  tags: ['#api', '#spotify', '#personalwebsite'],
},

  {
    id: 5,
    title: 'From Bench to Browser: My Dual Identity',
    content: [
      'Some days I’m in the lab culturing yeast strains and analyzing citric acid intermediates. Other days I’m designing REST APIs and debugging TypeScript errors. Balancing biochemistry and computer science isn’t just academic; it’s the intersection of logic and life.',
      "What makes it work? Treating both domains as systems. Whether it's cellular metabolism or async state updates, I look for structure, flow, and signals. Bioinformatics isn’t just my major; it’s how I think."
    ],
    createdAt: '2025-05-28',
    updatedAt: '2025-05-28',
    tags: ['#bioinformatics', '#research', '#software'],
  },
];
