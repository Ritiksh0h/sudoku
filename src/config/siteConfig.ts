export const siteConfig = {
  name: "Sudoku Challenge",
  title: "Interactive Sudoku Game",
  url: `${process.env.NEXT_PUBLIC_APP_URL}`,
  ogImage: `${process.env.NEXT_PUBLIC_APP_URL}/sudoku-og.png`,
  ogImageSmall: `${process.env.NEXT_PUBLIC_APP_URL}/sudoku-og-small.png`,
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
    github: "https://github.com/yourusername/sudoku",
    issues: "https://github.com/yourusername/sudoku/issues",
    portfolio: "https://ritikshah.vercel.app",
  },
};

export type SiteConfig = typeof siteConfig;
