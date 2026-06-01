import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#AD7B49',
          light: '#C99668',
          dark: '#8B5F38',
        },
        offwhite: '#F4F2F2',
        graydark: '#3F3F3F',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
