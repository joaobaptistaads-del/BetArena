import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED',
        accent: '#22D3EE',
      },
    },
  },
  plugins: [],
};

export default config;
