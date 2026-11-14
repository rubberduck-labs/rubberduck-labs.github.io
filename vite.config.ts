import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// På GitHub Pages leveres public/404.html for /live/ (siden er bevisst en «404»). Her gjør dev-serveren det samme,
// så live-siden kan åpnes lokalt på http://localhost:5194/live/. Gjelder bare «vite dev», ikke bygget.
function liveDevPage(): Plugin {
  return {
    name: 'live-dev-page',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url || !/^\/live(\/|\?|$)/.test(req.url)) return next();
        try {
          const html = readFileSync(resolve(server.config.root, 'public/404.html'), 'utf-8');
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.setHeader('Cache-Control', 'no-store');
          res.end(html);
        } catch {
          next();
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), liveDevPage()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  base: "/",
  build: {
    outDir: "docs",
  }
});
