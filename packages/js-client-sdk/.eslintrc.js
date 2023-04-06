module.exports = {
  root: true,
  extends: ["paperxyz"],
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  rules: {
    "@typescript-eslint/no-unsafe-member-access": "warn",
    "@typescript-eslint/no-unsafe-argument": "warn",
    "@typescript-eslint/no-unsafe-call": "warn",
    "@typescript-eslint/restrict-plus-operands": "warn",
    "@typescript-eslint/no-var-requires": "warn",
    "@typescript-eslint/restrict-template-expressions": "warn",
  },
};
