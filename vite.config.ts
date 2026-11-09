import { defineConfig } from 'vite';

export default defineConfig({
  // 'mpa' turns off the SPA history fallback, so a bad URL 404s instead of
  // quietly serving the home page. Real pages still resolve by path.
  appType: 'mpa',
  build: {
    rollupOptions: {
      // Each route needs its entry listed or the build only emits the root
      // page -- the dev server discovers them on its own, the build does not.
      // Paths are relative to `root`.
      input: {
        home: 'index.html',
        realevate: 'realevate/index.html',
        'sticky-cards': 'sticky-cards/index.html',
      },
    },
  },
});
