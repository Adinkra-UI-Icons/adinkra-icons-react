import { execFileSync } from "node:child_process";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import assert from "node:assert/strict";

const root = fileURLToPath(new URL("../", import.meta.url));
// Use installed development peers from the parent node_modules, but load the
// library exclusively from its tarball, with no access to its source exports.
const temp = await mkdtemp(join(root, "node_modules", ".package-check-"));
const run = (command, args, cwd = temp) =>
  execFileSync(command, args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
try {
  const [archive] = JSON.parse(
    run(
      "npm",
      [
        "pack",
        "--ignore-scripts",
        "--json",
        "--pack-destination",
        temp,
        "--cache",
        join(temp, "npm-cache"),
      ],
      root,
    ),
  );
  await writeFile(
    join(temp, "package.json"),
    JSON.stringify({ private: true, type: "module" }),
  );
  run("npm", [
    "install",
    join(temp, archive.filename),
    "--offline",
    "--ignore-scripts",
    "--legacy-peer-deps",
    "--no-audit",
    "--no-fund",
    "--cache",
    join(temp, "npm-cache"),
  ]);
  const consumer = `
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { AdAbanSans } from 'adinkra-icons-react';
import Direct from 'adinkra-icons-react/icons/AdAbanSans';
if (renderToStaticMarkup(createElement(AdAbanSans)) !== renderToStaticMarkup(createElement(Direct))) {
  throw new Error('Root and direct imports disagree');
}
`;
  await writeFile(join(temp, "consumer.mjs"), consumer);
  await writeFile(
    join(temp, "consumer.cjs"),
    `
const { createElement } = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { AdAbanSans } = require('adinkra-icons-react');
const Direct = require('adinkra-icons-react/icons/AdAbanSans').default;
if (renderToStaticMarkup(createElement(AdAbanSans)) !== renderToStaticMarkup(createElement(Direct))) {
  throw new Error('CommonJS root and direct imports disagree');
}
`,
  );
  run(process.execPath, ["consumer.mjs"]);
  run(process.execPath, ["consumer.cjs"]);
  const typeConsumer = `
import { createElement } from 'react';
import { AdAbanSans, type IconProps } from 'adinkra-icons-react';
import Direct from 'adinkra-icons-react/icons/AdAbanSans';
const props: IconProps = { width: 24, color: 'brown', title: 'Aban' };
createElement(AdAbanSans, props);
createElement(Direct, props);
`;
  await writeFile(join(temp, "consumer.mts"), typeConsumer);
  await writeFile(join(temp, "consumer.cts"), typeConsumer);
  run(process.execPath, [
    resolve(root, "node_modules/typescript/bin/tsc"),
    "--noEmit",
    "--strict",
    "--module",
    "NodeNext",
    "--moduleResolution",
    "NodeNext",
    "--target",
    "ES2020",
    "consumer.mts",
    "consumer.cts",
  ]);
  // Classic node10 resolution ignores `exports`, so it relies on `typesVersions`.
  await writeFile(join(temp, "consumer-node10.ts"), typeConsumer);
  run(process.execPath, [
    resolve(root, "node_modules/typescript/bin/tsc"),
    "--noEmit",
    "--strict",
    "--module",
    "CommonJS",
    "--moduleResolution",
    "node10",
    "--ignoreDeprecations",
    "5.0",
    "--esModuleInterop",
    "--jsx",
    "react-jsx",
    "--target",
    "ES2020",
    "consumer-node10.ts",
  ]);
  const bundles = [];
  for (const contents of [
    'export { AdAbanSans } from "adinkra-icons-react";',
    'export { default as AdAbanSans } from "adinkra-icons-react/icons/AdAbanSans";',
  ]) {
    const result = await build({
      stdin: { contents, resolveDir: temp },
      bundle: true,
      format: "esm",
      write: false,
      minify: true,
      external: ["react", "react/jsx-runtime"],
    });
    bundles.push(result.outputFiles[0].text);
  }
  assert.ok(
    Math.abs(bundles[0].length - bundles[1].length) < 100,
    "Root imports must be as small as per-icon imports",
  );
  console.log(
    `Archive consumers passed: ESM, CommonJS, NodeNext/node10 types; single-icon bundle ${bundles[0].length} bytes.`,
  );
} catch (error) {
  if (error.stdout) console.error(error.stdout.toString());
  if (error.stderr) console.error(error.stderr.toString());
  throw error;
} finally {
  await rm(temp, { recursive: true, force: true });
}
