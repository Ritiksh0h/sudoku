export const siteConfig = {
  name: "Sudoku Challenge",
  title: "Interactive Sudoku Game",
  url: `https://sudoku-ritikshah.vercel.app`,
  ogImage: `https://sudoku-ritikshah.vercel.app/sudoku-og.png`,
  ogImageSmall: `https://sudoku-ritikshah.vercel.app/sudoku-og-small.png`,
  description:
    "Play interactive Sudoku puzzles of varying difficulty. Test your logical thinking and number placement skills.",
  creator: {
    name: "Ritik Shah",
    role: "Web Developer",
    portfolio: "https://ritikshah.vercel.app",
  },
  features: [
    "Multiple difficulty levels",
    "Timer and scoring system",
    "Hint system",
    "Daily challenges",
  ],
  links: {
    github: "https://github.com/Ritiksh0h/sudoku",
    issues: "https://github.com/Ritiksh0h/sudoku/issues",
    portfolio: "https://ritikshah.vercel.app",
  },
};

export type SiteConfig = typeof siteConfig;
