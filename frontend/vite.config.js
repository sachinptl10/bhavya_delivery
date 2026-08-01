import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        // Split heavy third-party libraries into cached, parallel-loadable chunks.
        codeSplitting: {
          groups: [
            { name: 'react-vendor', test: /node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\// },
            { name: 'charts-vendor', test: /node_modules\/(recharts|victory-vendor|d3-[a-z-]+)\// },
            { name: 'motion-vendor', test: /node_modules\/(framer-motion|motion-dom|motion-utils)\// },
            { name: 'firebase-vendor', test: /node_modules\/firebase\// },
            { name: 'ui-vendor', test: /node_modules\/(lucide-react|react-hot-toast|react-loading-skeleton|clsx|tailwind-merge)\// },
          ],
        },
      },
    },
  },
})
