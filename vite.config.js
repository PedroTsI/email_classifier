// vite.config.js (na raiz do projeto React)

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // ======================================================
  // CONFIGURAÇÃO DO PROXY PARA CONTORNAR O CORS
  // ======================================================
  server: {
    proxy: {
      // Quando o front-end requisitar /api (ou /classify_file)
      '/classify_file': {
        // Redirecione a requisição para o seu backend
        target: 'http://127.0.0.1:8000', 
        // Necessário para que o backend receba a URL correta
        changeOrigin: true, 
        // Opcional, mas útil se você quiser que o proxy substitua o caminho
        // rewrite: (path) => path.replace(/^\/api/, ''), 
      },
    }
  }
})