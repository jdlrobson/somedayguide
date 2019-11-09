import { terser } from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss'
import commonjs from 'rollup-plugin-commonjs';
const MODE = process.env.MODE;

const pluginsjsonly = [
    resolve(),
    commonjs(),
    postcss()
];

const pluginsindex = [
    resolve(),
    commonjs(),
    postcss({extract: true, minimize: true})
];

if (MODE === 'production') {
    pluginsjsonly.push(terser());
    pluginsindex.push(terser());
}

export default [
    {
        input: 'src/index.js',
        plugins: pluginsindex,
        output: {
            format: 'iife',
            dir: 'public/'
        }
    },
    {
        input: 'src/sw.js',
        plugins: pluginsjsonly,
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
        input: 'src/search.js',
        plugins: pluginsjsonly,
        output: {
            format: 'iife',
            dir: 'public/'
        }
    }
];
