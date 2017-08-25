import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    external: [
        `react`
    ],
    input: `src/index.js`,
    name: `fooooooo`,
    output: {
        file: `lib/index.js`,
        format: `umd`
    },
    plugins: [
        babel({
            exclude: `node_modules/**`
        }),
        nodeResolve({
            
        }),
        commonjs({
            include: 'node_modules/**',
            sourceMap: false
        })
    ]
};
