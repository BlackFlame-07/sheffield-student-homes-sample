const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = process.env.PORT || parseInt(process.argv[2] || '3000', 10);
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.mp4': 'video/mp4',
  '.ico': 'image/x-icon'
};

const COMPRESSIBLE = new Set([
  'text/html; charset=utf-8',
  'text/css; charset=utf-8',
  'application/javascript; charset=utf-8',
  'application/json; charset=utf-8',
  'image/svg+xml'
]);

const server = http.createServer((req, res) => {
  try {
    let cleanUrl = req.url.split('?')[0].split('#')[0];
    let filePath = path.join(ROOT, cleanUrl);

    // 1. Directory routing
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    } else if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    } else if (!fs.existsSync(filePath) && fs.existsSync(path.join(filePath, 'index.html'))) {
      filePath = path.join(filePath, 'index.html');
    }

    // 2. Intelligent Static Asset Fallback
    if (!fs.existsSync(filePath)) {
      const baseName = path.basename(cleanUrl);
      const candidates = [
        path.join(ROOT, 'assets', cleanUrl),
        path.join(ROOT, 'assets', baseName),
        path.join(ROOT, baseName)
      ];
      for (const cand of candidates) {
        if (fs.existsSync(cand) && !fs.statSync(cand).isDirectory()) {
          filePath = cand;
          break;
        }
      }
    }

    // 3. 404 Fallback
    if (!fs.existsSync(filePath)) {
      const ext = path.extname(cleanUrl).toLowerCase();
      if (!ext || ext === '.html') {
        filePath = path.join(ROOT, '404.html');
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404: Asset not found');
        return;
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const isAsset = filePath.includes(path.sep + 'assets' + path.sep) || ext === '.woff2' || ext === '.webp' || ext === '.png';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        if (!res.headersSent) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Server Error: ' + err.code);
        }
        return;
      }

      const headers = {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': isAsset
          ? 'public, max-age=31536000, immutable'
          : 'public, max-age=0, must-revalidate'
      };

      // Gzip Compression for compressible text payloads
      const acceptEncoding = req.headers['accept-encoding'] || '';
      if (COMPRESSIBLE.has(contentType) && acceptEncoding.includes('gzip')) {
        zlib.gzip(content, (zErr, gzipped) => {
          if (!zErr && !res.headersSent) {
            headers['Content-Encoding'] = 'gzip';
            headers['Content-Length'] = gzipped.length;
            res.writeHead(200, headers);
            res.end(gzipped);
          } else {
            headers['Content-Length'] = content.length;
            res.writeHead(200, headers);
            res.end(content);
          }
        });
      } else {
        headers['Content-Length'] = content.length;
        res.writeHead(200, headers);
        res.end(content);
      }
    });
  } catch (err) {
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Handler Error');
    }
  }
});

server.on('error', (err) => {
  console.error('Preview server socket error:', err.message);
});

process.on('uncaughtException', (err) => {
  console.error('Preview server uncaughtException:', err.message);
});

server.listen(PORT, () => {
  console.log('=======================================================');
  console.log('✨ MAISON EVORA HIGH-PERFORMANCE PREVIEW SERVER ACTIVE');
  console.log(`🚀 URL: http://localhost:${PORT}`);
  console.log(`📁 Directory: ${ROOT}`);
  console.log('⚡ Gzip Compression: Enabled');
  console.log('⚡ Immutable Caching: Enabled');
  console.log('=======================================================');
});
