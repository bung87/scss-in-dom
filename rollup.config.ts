
import babel from "rollup-plugin-babel";
import cleanup from "rollup-plugin-cleanup";
import commonjs from "rollup-plugin-commonjs";
import filesize from "rollup-plugin-filesize";
import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import json from '@rollup/plugin-json'
import pkg from "./package.json";
// import builtins from 'rollup-plugin-node-builtins';

const moduleVersion = "v" + pkg.version;
const nodePlugins = [
    json(),
    resolve(),
    // string({ include: '**/*.md' }),
    typescript({ useTsconfigDeclarationDir: true }),
    commonjs({ include: "node_modules/**" }),
    babel({
        exclude: "node_modules/**"
      }),
];

const banner = "/* " + pkg.name + " " + moduleVersion + " */";
const esmBuild = {
    external: Object.keys(pkg.dependencies || {}).concat(Object.keys(pkg.peerDependencies || {})),
    input: "src/index.ts",
    output: {
        banner,
        file: pkg.module,
        format: "esm",
        sourcemap: false,
    },
    plugins: [
        json(),
        typescript({ useTsconfigDeclarationDir: true }),
        cleanup(),
        filesize(),
    ],
    watch: {
        clearScreen: false,
    },
};
const commonJSBuild = {
    ...esmBuild,
    plugins: [
        ...nodePlugins,
        cleanup(),
        filesize(),
    ],
    // tslint:disable-next-line: object-literal-sort-keys
    output: { file: pkg.main, format: "cjs", banner, sourcemap: false },
};
const browserBuilds = {
    ...esmBuild,
    plugins: [
        json(),
        // builtins(),
        typescript({  useTsconfigDeclarationDir: true }),
        resolve({ browser: true }),
        commonjs(),
        babel({
            exclude: "node_modules/**"
          }),
        cleanup(),
        filesize(),
    ],
    // tslint:disable-next-line: object-literal-sort-keys
    output: { name: "sid", file: pkg.browser, format: "umd", banner, sourcemap: true },
};
// tslint:disable-next-line:no-default-export
export default [esmBuild, commonJSBuild, browserBuilds];
