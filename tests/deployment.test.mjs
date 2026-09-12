import test from 'node:test';
import assert from 'node:assert/strict';
import { deployment } from '../src/lib/deployment.mjs';

test('local previews do not inherit a repository path', () => {
  assert.deepEqual(deployment({ GITHUB_REPOSITORY: 'someone/my-site' }), { base: '/' });
});
test('GitHub project Pages and custom domains use their published path', () => {
  assert.deepEqual(deployment({ SITE_URL: 'https://artist.github.io/my-work/' }), { site: 'https://artist.github.io', base: '/my-work' });
  assert.deepEqual(deployment({ SITE_URL: 'https://artist.example/' }), { site: 'https://artist.example', base: '/' });
  assert.deepEqual(deployment({ SITE_URL: 'https://artist.github.io/' }), { site: 'https://artist.github.io', base: '/' });
});
test('Cloudflare previews work at the root; explicit URL wins', () => {
  assert.deepEqual(deployment({ CF_PAGES_URL: 'https://branch.example.pages.dev' }), { site: 'https://branch.example.pages.dev', base: '/' });
  assert.equal(deployment({ SITE_URL: 'https://artist.example', CF_PAGES_URL: 'https://example.pages.dev' }).site, 'https://artist.example');
});
test('invalid protocols fail with a useful message', () => {
  assert.throws(() => deployment({ SITE_URL: 'file:///tmp/site' }), /SITE_URL/);
});
