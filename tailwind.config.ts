import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // プライマリカラー（エメラルドグリーン系）
        primary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        // アクセントカラー
        accent: {
          DEFAULT: '#10b981',
          light: '#34d399',
          dark: '#047857',
        },
      },
      // スマホファーストのフォントサイズ
      fontSize: {
        'base': ['16px', '1.6'],
        'lg': ['18px', '1.6'],
      },
      // タップターゲット用の最小サイズ
      minHeight: {
        'tap': '44px',
      },
      minWidth: {
        'tap': '44px',
      },
    },
  },
  plugins: [],
};
export default config;
