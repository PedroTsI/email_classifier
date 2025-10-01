import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  server: {
    proxy: {
      // Quando o front-end requisitar /api (ou /classify_file)
      '/classify_file': {
        // Redirecione a requisição para o seu backend
        target: 'http://127.0.0.1:8000/classify_file', 
        // Necessário para que o backend receba a URL correta
        changeOrigin: true, 
        // Opcional, mas útil se você quiser que o proxy substitua o caminho
        // rewrite: (path) => path.replace(/^\/api/, ''), 
      },
    }
  }
})