export default {
  server: {
    host: true, // Listen on all addresses
    port: 5173,
    cors: true, // Enable CORS for all routes
    // Add proxy for API requests to avoid CORS issues during development
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  preview: {
    port: 5173,
  },
  // Add this to handle environment variables
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://localhost:8080'),
  },
} 