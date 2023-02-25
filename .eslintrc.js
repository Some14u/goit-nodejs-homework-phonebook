module.exports = {
  parser: "@babel/eslint-parser",
  plugins: ["jest"],
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    "jest/globals": true,
  },
  extends: ["standard", "prettier"],
  parserOptions: {
    ecmaVersion: 12,
    requireConfigFile: false,
  },
  rules: {
    "no-unused-vars": ["warn", { args: "all", argsIgnorePattern: "^_" }],
    "no-warning-comments": [
      "warn",
      {
        terms: ["todo", "fixme"],
        location: "start",
      },
    ],
  },
};
