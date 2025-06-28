// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  // ADD THIS THEME EXTENSION
  theme: {
    extend: {
      colors: {
        // This 'ring' definition overrides Tailwind's default color processing
        // for any utility using 'ring' with an opacity modifier (e.g., ring/50).
        ring: ({ opacityVariable, opacityValue }) => {
          if (opacityValue !== undefined) {
            // If an explicit opacity is provided (e.g., ring-opacity-50 or ring/50),
            // we'll use color-mix with 'srgb' for the mixing.
            // Ensure your --ring variable is accessible and correctly formatted (e.g., hex, rgb, hsl).
            return `color-mix(in srgb, var(--ring) ${opacityValue * 100}%, transparent)`;
          }
          // Fallback for when 'ring' is used without an opacity modifier.
          // It will simply use the raw CSS variable '--ring'.
          return `var(--ring)${opacityVariable ? ` / ${opacityVariable}` : ''}`;
        },
      },
    },
  },
})