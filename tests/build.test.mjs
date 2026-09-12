import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { deployment } from '../src/lib/deployment.mjs';

const root = resolve('dist');
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)]);
}
test('built routes, images and local links resolve, including a Pages subpath', () => {
  assert.ok(existsSync(root), 'Run npm run build before npm test.');
  const base = deployment(process.env).base.replace(/\/$/, '');
  const htmlFiles = walk(root).filter(file => file.endsWith('.html'));
  assert.ok(htmlFiles.length >= 5);
  for (const file of htmlFiles) {
    const html = readFileSync(file, 'utf8');
    assert.match(html, /THESIS:/, 'Design contract survives production build');
    for (const [, raw] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (!raw.startsWith('/') || raw.startsWith('//')) continue;
      assert.ok(!base || raw.startsWith(`${base}/`), `${file}: wrong base for ${raw}`);
      const relative = decodeURIComponent(raw.slice(base.length)).split(/[?#]/)[0];
      const target = join(root, relative.endsWith('/') ? `${relative}index.html` : relative);
      assert.ok(existsSync(target), `${file}: missing ${raw}`);
    }
  }
});
test('each Markdown project has its own page and appears in both browsing views', () => {
  const home = readFileSync(join(root, 'index.html'), 'utf8');
  const index = readFileSync(join(root, 'index/index.html'), 'utf8');
  for (const file of readdirSync('src/content/projects').filter(f => f.endsWith('.md'))) {
    const slug = file.slice(0, -3);
    assert.ok(existsSync(join(root, `projects/${slug}/index.html`)));
    assert.ok(home.includes(`data-project="${slug}"`));
    assert.ok(index.includes(`data-project="${slug}"`));
  }
});
