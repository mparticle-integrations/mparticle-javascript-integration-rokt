import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const kitName = 'Rokt';

const outputs = {
    name: `${kitName}Kit`,
    exports: 'named',
    strict: true,
};

const plugins = [
    resolve({ 
        browser: true
    }),
    commonjs(),
];

export default [
    {
        input: `src/${kitName}-Kit.js`,
        output: {
            ...outputs,
            format: 'iife',
            file: `dist/${kitName}-Kit.iife.js`,
        },
        plugins,
    },
    {
        input: `src/${kitName}-Kit.js`,
        output: {
            ...outputs,
            format: 'cjs',
            file: `dist/${kitName}-Kit.common.js`,
        },
        plugins,
    },
];