module.exports = {
  root: true,
  extends: ["paperxyz"],
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  rules: {
    "@typescript-eslint/no-unsafe-argument": "warn",
    "@typescript-eslint/restrict-template-expressions": "warn",
    "@typescript-eslint/no-unsafe-member-access": "warn",
    "@typescript-eslint/no-var-requires": "warn",
    "@typescript-eslint/no-unsafe-assignment": "warn",
    "@typescript-eslint/restrict-plus-operands": "warn",
    "@typescript-eslint/no-floating-promises": "warn",
    "@typescript-eslint/ban-ts-comment": "warn",
    "@typescript-eslint/no-empty-function": "warn",
  },
};
