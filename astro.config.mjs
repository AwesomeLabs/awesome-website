// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Netlify's dev context sets AL_SITE_URL so preview deploys get correct
// canonicals (and a noindex _headers file — see netlify.toml).
const site = process.env.AL_SITE_URL ?? 'https://isjustawesome.com';

export default defineConfig({
  site,
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
  integrations: [
    sitemap({
      changefreq: 'monthly',
      lastmod: new Date(),
      serialize(item) {
        if (item.url === `${site}/`) {
          item.priority = 1.0;
          // The serialized item types changefreq as the sitemap package's
          // EnumChangefreq, whose values are these same strings. Casting
          // beats adding a direct dependency on `sitemap` just for the enum.
          item.changefreq = /** @type {typeof item.changefreq} */ ('weekly');
        } else {
          // /team/, /privacy/, /terms/ — real pages, but not what anyone
          // searches for. Listed because the client wants them indexed.
          item.priority = 0.5;
        }
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
