import { defineConfig } from 'vite'

export default defineConfig({
    server:{
        proxy: {
            '/api': {
              target: 'http://localhost:3000',
              // secure: true,      
              // ws: true,
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, ''),
            }
        }
    }
})

// const config = {
//     // outDir: '../wwwroot/',
    
//   };
  
//   export default config;
