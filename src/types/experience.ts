export interface Experience {
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  points: string[];
  companyUrl?: string;
  iconType: 'code' | 'science' | 'web' | 'school';
  themeColor: {
    dark: string;
    light: string;
  };
} 