import { terser } from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss'
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

const MODE = process.env.MODE;

const RESOLVEOPTIONS = {
    // you likely have this specified, which is incorrect:
    mainFields: ['module', 'browser', 'main']
};

const pluginsjsonly = [
    resolve(RESOLVEOPTIONS),
    babel(),
    commonjs(),
    postcss()
];

const pluginsindex = [
    resolve(RESOLVEOPTIONS),
    babel(),
    commonjs(),
    postcss({extract: true, minimize: true})
];

if (MODE === 'production') {
    pluginsjsonly.push(terser());
    pluginsindex.push(terser());
}

export default [
    {
        input: 'src/tools/tools.js',
        plugins: pluginsindex,
        output: {
            format: 'iife',
            dir: 'public/'
        }
    },
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
