type TailwindFontSize =
  | 'text-xs'    // 0.75rem
  | 'text-sm'    // 0.875rem
  | 'text-base'  // 1rem
  | 'text-lg'    // 1.125rem
  | 'text-xl'    // 1.25rem
  | 'text-2xl'   // 1.5rem
  | 'text-3xl'   // 1.875rem
  | 'text-4xl'   // 2.25rem
  | 'text-5xl'   // 3rem
  | 'text-6xl'   // 3.75rem
  | 'text-7xl'   // 4.5rem
  | 'text-8xl'   // 6rem
  | 'text-9xl';  // 8rem

export type HandbookBlock =
  | {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
}
  | {
  type: 'paragraph' | 'centeredParagraph' | 'quote';
  text: string;
  size?: TailwindFontSize;
}
  | {
  type: 'list';
  items: string[];
  size?: TailwindFontSize;
};

export interface BookPage {
  title?: string;
  content:  HandbookBlock[];
  isSpecial?: boolean;
}

export type BookChapters = {
  chapter: string;
  pages: BookPage[];
};
