import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import { minify } from "rollup-plugin-swc3";
import alias from "@rollup/plugin-alias";

export default {
  input: "src/index.ts",
  output: [
    {
      dir: "lib/esm",
      format: "esm",
      exports: "named",
      preserveModules: true,
      preserveModulesRoot: "src",
    },
    {
      file: "lib/cjs/index.js",
      format: "cjs",
      exports: "named",
    },
  ],

  plugins: [
    alias({
      entries: [{ find: "@/*", replacement: "src/*" }],
    }),
    resolve(),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
      clean: true,
      abortOnError: false,
    }),
    minify(),
  ],
  external: ["node:fs/promises", "node-forge", "node:os","inquirer","chalk","open"],
};
