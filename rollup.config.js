import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import globals from 'rollup-plugin-node-globals';
import nodePolyfills from 'rollup-plugin-node-polyfills';

export default {
  input: 'node_modules/@mdjs/core/index.js',
  output: {
    dir: 'dist',
    format: 'esm',
  },
  plugins: [
    //
    resolve({ preferBuiltins: false }),
    json(),
    commonjs(),
    globals(),
    nodePolyfills(),
  ],
};
