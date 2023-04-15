module.exports = {
  extends: ["paperxyz"],
  root: true,
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  rules: {
    "@typescript-eslint/unbound-method": "warn",
  },
};
