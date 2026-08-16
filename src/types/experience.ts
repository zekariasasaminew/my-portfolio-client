export interface Experience {
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  points: string[];
  techTags?: string[];
  companyUrl?: string;
  detailLink?: string;
  logoDomain?: string;
  iconType: 'code' | 'science' | 'web' | 'school';
  themeColor: {
    dark: string;
    light: string;
  };
} 