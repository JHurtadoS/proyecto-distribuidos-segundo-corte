const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
  
  // Handle API proxy for production server
  if (req.url.startsWith('/api/')) {
    const targetUrl = `http://localhost:8080${req.url.replace('/api', '')}`;
    console.log(`Proxying request to: ${targetUrl}`);
    
    // This is a very basic proxy implementation
    // In a real app, use a proper proxy library like http-proxy
    const proxyReq = http.request(
      targetUrl, 
      { 
        method: req.method, 
        headers: req.headers 
      }, 
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
      }
    );
    
    req.pipe(proxyReq);
    proxyReq.on('error', (err) => {
      console.error('Proxy error:', err);
      res.writeHead(500);
      res.end('Proxy error');
    });
    
    return;
  }

  // Handle static files
  let filePath = req.url === '/' ? './dist/index.html' : `./dist${req.url}`;
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    // If not found, serve index.html (for SPA routing)
    filePath = './dist/index.html';
  }
  
  const extname = path.extname(filePath);
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end(`Server Error: ${err.code}`);
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`API requests will be proxied to http://localhost:8080`);
}); 