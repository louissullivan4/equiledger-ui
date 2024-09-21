import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser, // Browser globals
        ...globals.node,    // Node.js globals
        es2021: true,       // Enable ES2021 features
      },
    },
    settings: {
      react: {
        version: "^18.3.1",
      },
    },
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
];
