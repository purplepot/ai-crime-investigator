/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        surface: {
          DEFAULT: "var(--color-surface)",
          hover: "var(--color-surface-hover)"
        },
        border: "var(--color-border)",
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)"
        },
        accent: {
          red: "var(--color-accent-red)",
          green: "var(--color-accent-green)",
          amber: "var(--color-accent-amber)",
          blue: "var(--color-accent-blue)"
        },
        agent: {
          lead: "var(--color-text-primary)",
          evidence: "var(--color-text-secondary)",
          suspect: "var(--color-text-secondary)",
          interview: "var(--color-text-secondary)",
          timeline: "var(--color-text-secondary)",
          prosecutor: "var(--color-text-secondary)"
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'minimal': '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
