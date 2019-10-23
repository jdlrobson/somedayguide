import { terser } from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss'
import commonjs from 'rollup-plugin-commonjs';

const pluginsjsonly = [
    resolve(),
    commonjs(),
    terser(),
    postcss()
];

export default [
    {
        input: 'src/index.js',
        plugins: [
            resolve(),
            commonjs(),
            terser(),
            postcss({extract: true, minimize: true})
        ],
        output: {
            format: 'iife',
            dir: 'public/'
        }
    },
    {
        input: 'src/map/map.js',
        plugins: pluginsjsonly,
        output: {
            format: 'iife',
            dir: 'public/'
        }
    },
    {
        input: 'src/index--js.js',
        plugins: pluginsjsonly,
        output: {
            format: 'iife',
            dir: 'public/'
        }
    }
];
