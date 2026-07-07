import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@appigrejas/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@appigrejas/types': path.resolve(__dirname, '../../packages/types/src'),
      '@appigrejas/utils': path.resolve(__dirname, '../../packages/utils/src'),
      '@appigrejas/api-contracts': path.resolve(__dirname, '../../packages/api-contracts/src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
