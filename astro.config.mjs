import { defineConfig } from 'astro/config';
import { deployment } from './src/lib/deployment.mjs';

export default defineConfig({
  ...deployment(process.env),
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
