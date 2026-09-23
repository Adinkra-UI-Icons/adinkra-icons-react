import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/icons/*.tsx'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  // Keep the root barrel as re-exports so unused icon modules disappear entirely.
  esbuildOptions(options, { format }) {
    // CommonJS stays bundled so require() never resolves an ESM .js file.
    options.bundle = format === 'cjs';
  },
  clean: true,
  external: ['react', 'react/jsx-runtime'],
  outExtension: ({ format }) => ({ js: format === 'cjs' ? '.cjs' : '.js' }),
});
