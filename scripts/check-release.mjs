import { readFile, readdir } from 'node:fs/promises';
const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
if (pkg.license === 'UNLICENSED') throw new Error('Choose the code and artwork licenses before publishing.');
if (!(await readdir(new URL('../icons/', import.meta.url))).some(file => file.endsWith('.svg'))) {
  throw new Error('Add the real SVG icon collection before publishing.');
}
