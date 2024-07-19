import type { Config } from 'tailwindcss'
import tailwindForms from '@tailwindcss/forms'
import { addDynamicIconSelectors } from '@iconify/tailwind'

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
    tailwindForms,
    addDynamicIconSelectors({
      scale: 0,
    }),
  ],
} satisfies Config
