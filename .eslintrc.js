module.exports = {
  parser: "@babel/eslint-parser",

  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ["standard", "prettier"],
  parserOptions: {
    ecmaVersion: 12,
    requireConfigFile: false,
  },
  rules: {
    "no-unused-vars": ["warn", { args: "all", argsIgnorePattern: "^_" }],
  },
};
