import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

import { terser } from "rollup-plugin-terser";

export default {
  input: "lib/index.js",
  output: {
    dir: "dist",
    format: "esm",
    exports: "auto",
  },
  plugins: [resolve({ preferBuiltins: false }), commonjs(), json(), terser()],
  resolveImportMeta(property, { moduleId }) {
    console.log(property);
    return null;
  },
};
