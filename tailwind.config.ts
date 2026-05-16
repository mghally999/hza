import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B2150',
          900: '#071638',
          800: '#0B2150',
          700: '#102C68',
          600: '#1A4F9E',
          500: '#2C6CC9',
        },
        gold: {
          DEFAULT: '#D4A017',
          600: '#B8861A',
          500: '#D4A017',
          400: '#E0AE3D',
          300: '#F4D580',
          200: '#FAEBC1',
        },
        cream: {
          DEFAULT: '#FAF6EC',
          50: '#FDFBF5',
          100: '#FAF6EC',
          200: '#F2EBD9',
        },
        ink: '#0A1530',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-arabic)', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.05em',
      },
    },
  },
  plugins: [],
};

export default config;
