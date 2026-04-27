import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // GitHub Pages 部署时需要设置 base 路径
  // 如果部署到 https://username.github.io/ ，使用 '/'
  // 如果部署到 https://username.github.io/repo-name/ ，使用 '/repo-name/'
  base: 'https://username.github.io/badminton-score-app/',
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
})
