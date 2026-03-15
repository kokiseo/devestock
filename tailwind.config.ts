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
        // プライマリカラー（ネイビー系）
        primary: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#102a43',
        },
        // アクセントカラー
        accent: {
          DEFAULT: '#3182ce',
          light: '#63b3ed',
          dark: '#2c5282',
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
