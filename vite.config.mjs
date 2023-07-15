import { defineConfig } from 'vite'

export default defineConfig({
    server:{
        proxy: {
            '/api': {
              target: 'http://localhost:3000',
              changeOrigin: true,
              secure: true,      
              ws: true,
              configure: (proxy, _options) => {
                proxy.on('error', (err, _req, _res) => {
                  console.log('proxy error', err);
                });
                proxy.on('proxyReq', (proxyReq, req, _res) => {
                  console.log('Sending Request to the Target:', req.method, req.url);
                });
                proxy.on('proxyRes', (proxyRes, req, _res) => {
                  console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
                });
              },
            }
        }
    }
})

// const config = {
//     // outDir: '../wwwroot/',
    
//   };
  
//   export default config;
