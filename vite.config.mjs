import { defineConfig } from 'vite'

export default defineConfig({
    server:{
        proxy: {
            '/api': {
              target: 'http://0.0.0.0:3000',
              // secure: true,      
              // ws: true,
              rewrite: (path) => path.replace(/^\/api/, ''),
            }
        }
    }
})

// const config = {
//     // outDir: '../wwwroot/',
    
//   };
  
//   export default config;
