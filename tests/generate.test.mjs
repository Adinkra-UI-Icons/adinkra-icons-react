import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { generate, componentName } from '../scripts/generate.mjs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createRequire } from 'node:module';

test('generates typed components and rejects colliding names', async () => {
  const root = await mkdtemp(join(tmpdir(), 'adinkra-test-'));
  try {
    const input = join(root, 'input');
    const output = join(root, 'output');
    await mkdir(input);
    const svg = '<svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" d="M2 2h20"/></svg>';
    await writeFile(join(input, 'test-shape.svg'), svg);
    assert.deepEqual(await generate(input, output), ['AdTestShape']);
    const code = await readFile(join(output, 'icons/AdTestShape.tsx'), 'utf8');
    assert.match(code, /viewBox="0 0 24 24"/);
    assert.match(code, /stroke="currentColor"/);
    assert.match(code, /forwardRef/);
    await writeFile(join(input, 'test_shape.svg'), svg);
    await assert.rejects(generate(input, output), /Duplicate component/);
    await rm(join(input, 'test_shape.svg'));
    await writeFile(join(input, 'test-shape.svg'), '<svg/>');
    await assert.rejects(generate(input, output), /viewBox/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('normalizes black, scopes referenced IDs, and uses the public props type', async () => {
  const root = await mkdtemp(join(tmpdir(), 'adinkra-test-'));
  try {
    const input = join(root, 'input');
    const output = join(root, 'output');
    await mkdir(input);
    await writeFile(join(input, 'Upper.SVG'), '<svg viewBox="0 0 8 8" id=\'root\'>' +
      '<defs><clipPath id="a"><rect width="4" height="4"/></clipPath></defs>' +
      '<path id="decor" fill="#000" stroke="rgb(0,0,0)" clip-path="url(#a)" d="M0 0h8v8z"/></svg>');
    assert.deepEqual(await generate(input, output), ['AdUpper']);
    const code = await readFile(join(output, 'icons/AdUpper.tsx'), 'utf8');
    assert.match(code, /IconProps/);
    assert.doesNotMatch(code, /SVGRProps/);
    assert.match(code, /\/\*#__PURE__\*\/forwardRef/);
    assert.doesNotMatch(code, /#000|rgb\(/);
    assert.doesNotMatch(code, /id="decor"|id="root"/);
    assert.match(code, /id="AdUpper-a"/);
    assert.match(code, /url\(#AdUpper-a\)/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('names retain source spellings', () => {
  assert.equal(componentName('GyeNyame-sans.svg'), 'AdGyeNyameSans');
});

test('built ESM and CommonJS icons render with standard SVG props', async () => {
  const esm = await import('../dist/index.js');
  const cjs = createRequire(import.meta.url)('../dist/index.cjs');
  const sources = (await readdir(new URL('../icons/', import.meta.url))).filter(file => file.endsWith('.svg'));
  assert.ok(sources.length > 0, 'The package must contain real icons');
  assert.equal(Object.keys(esm).length, sources.length);
  assert.deepEqual(Object.keys(esm).sort(), Object.keys(cjs).sort());
  for (const [name, Icon] of Object.entries(esm)) {
    const markup = renderToStaticMarkup(createElement(Icon, {
      width: 32, height: 32, title: name, role: 'img', 'aria-label': name,
    }));
    assert.match(markup, /<svg/);
    assert.match(markup, /width="32"/);
    assert.match(markup, /viewBox=/);
    assert.match(markup, /fill="currentColor"/);
    assert.doesNotMatch(markup, /(?:fill|stroke)="(?:black|#000(?:000)?)"/i);
    assert.equal(renderToStaticMarkup(createElement(cjs[name])), renderToStaticMarkup(createElement(Icon)));
    assert.match(markup, new RegExp(`<title[^>]*>${name}</title>`));
    const direct = await import(`adinkra-icons-react/icons/${name}`);
    assert.equal(renderToStaticMarkup(createElement(direct.default)), renderToStaticMarkup(createElement(Icon)));
    const directCjs = createRequire(import.meta.url)(`adinkra-icons-react/icons/${name}`).default;
    assert.equal(renderToStaticMarkup(createElement(directCjs)), renderToStaticMarkup(createElement(Icon)));
  }
});
