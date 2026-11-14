export interface Note {
    id: number;
    title: string;
    hook: string;
    content: string[];
    createdAt: string;
    tags: string[];
    href?: string;
    readMinutes?: number;
}
