import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import {
  terser
} from 'rollup-plugin-terser';
import bundleAnalyzer from 'rollup-plugin-visualizer';

const APP_ENV = process.env.APP_ENV || process.env.NODE_ENV;

const baseConfig = {
  external: [
    `react`
  ],
  input: `src/index.js`,
  output: {
    name: `i18nextReactPostprocessor`,
    sourcemap: APP_ENV !== `production`
      ? `inline`
      : false
  },
  plugins: [
    commonjs({
      include: [
        /node_modules/,
        `node_modules/react/**/*`
      ],
      sourcemap: false
    }),
    nodeResolve({
      preferBuiltins: true
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    babel({
      exclude: `node_modules/**`
    })
  ]
};

const umdConfig = {
  ...baseConfig,
  output: {
    ...baseConfig.output,
    file: `dist/index.js`,
    format: `umd`,
    globals: {
      'react': `React`,
      'react-dom': `ReactDOM`
    }
  },
  plugins: [
    ...baseConfig.plugins,
    ...(APP_ENV === `development`
        ? []
        : [ terser({}) ])
  ]
};

const esmConfig = {
  ...baseConfig,
  output: {
    ...baseConfig.output,
    file: `esm/index.js`,
    format: `es`
  },
  plugins: [
    ...baseConfig.plugins,
    ...(APP_ENV === `development`
        ? []
        : [ terser({}) ])
  ]
};

const demoConfig = {
  ...baseConfig,
  external: [],
  input: `example/index.src.js`,
  output: {
    ...baseConfig.output,
    file: `example/index.dist.js`,
    format: `iife`,
    globals: {},
    sourcemap: `inline`
  },
};

export default [
  umdConfig,
  esmConfig,
  demoConfig
];
