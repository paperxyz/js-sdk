module.exports = {
  root: true,
  extends: ["paperxyz"],
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  rules: {
    "@typescript-eslint/restrict-template-expressions": "warn",
    "@typescript-eslint/unbound-method": "warn",
  },
};
