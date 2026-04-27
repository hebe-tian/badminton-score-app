import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    reporters: ['default', 'junit'],
    outputFile: {
      junit: './junit-report.xml',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      thresholds: {
        global: {
          statements: 60,
          branches: 50,
          functions: 65,
          lines: 60,
        },
      },
      exclude: [
        '**/*.config.ts',
        '**/*.d.ts',
        'src/main.tsx',
        'src/types/**',
        'test/**',
      ],
    },
  },
})
