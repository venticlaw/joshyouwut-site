import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalog = JSON.parse(fs.readFileSync(path.join(site, 'assets/data/beats.json'), 'utf8'));
assert.equal(catalog.version, 1);
assert.ok(Array.isArray(catalog.beats));
const ids = new Set();
const files = new Set();
let totalBytes = 0;
for (const beat of catalog.beats) {
  assert.match(beat.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid beat ID');
  assert.ok(!ids.has(beat.id), `Duplicate beat ID: ${beat.id}`);
  ids.add(beat.id);
  assert.ok(typeof beat.title === 'string' && beat.title.trim());
  assert.ok(beat.bpm === null || (Number.isFinite(beat.bpm) && beat.bpm > 0));
  assert.ok(typeof beat.key === 'string' && beat.key.trim());
  assert.ok(Array.isArray(beat.tags) && beat.tags.every(tag => typeof tag === 'string'));
  assert.ok(Array.isArray(beat.genres) && beat.genres.every(genre => typeof genre === 'string'));
  assert.ok(beat.featured_order === null || (Number.isInteger(beat.featured_order) && beat.featured_order > 0));
  assert.equal(typeof beat.published, 'boolean');
  assert.ok(beat.file.startsWith('assets/audio/previews/') && beat.file.endsWith('.m4a'));
  const target = path.resolve(site, beat.file);
  assert.ok(target.startsWith(path.join(site, 'assets/audio/previews') + path.sep), 'Preview path escaped public preview directory');
  assert.ok(!files.has(target), `Duplicate preview: ${beat.id}`);
  files.add(target);
  const stat = fs.statSync(target);
  assert.ok(stat.size > 0 && stat.size < 2500000, `Unexpected preview size: ${beat.id}`);
  totalBytes += stat.size;
}
const expected = process.argv.find(arg => arg.startsWith('--expected='));
const published = catalog.beats.filter(beat => beat.published);
const catalogBeats = new Set(published.map(beat => beat.catalog_beat_id || beat.id));
if (expected) assert.equal(catalogBeats.size, Number(expected.split('=')[1]), 'Incomplete published catalog');
const config = JSON.parse(fs.readFileSync(path.join(site, 'assets/commerce/checkout-config.json'), 'utf8'));
assert.equal(config.products.beat_premium.inquiry_only, true);
if (!config.products.beat_starter.verified) {
  assert.equal(config.products.beat_starter.live, false);
  assert.equal(Object.keys(config.products.beat_starter.checkout_urls_by_beat).length, 0);
}
console.log(`Validated ${published.length} previews across ${catalogBeats.size} beats, ${published.filter(beat => beat.featured_order !== null).length} featured, ${(totalBytes / 1048576).toFixed(1)} MiB of compressed previews.`);
