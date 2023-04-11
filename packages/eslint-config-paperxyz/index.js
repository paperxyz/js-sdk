module.exports = {
  extends: [
    "turbo",
    "prettier",
    "eslint:recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "next",
  ],
  rules: {
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        prefer: "type-imports",
        fixStyle: "separate-type-imports",
      },
    ],
    "@typescript-eslint/consistent-type-exports": "error",
    "@typescript-eslint/no-unsafe-assignment": "warn",
    "@typescript-eslint/require-await": "off",
    "no-async-promise-executor": "off",
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: false,
        checkConditionals: true,
      },
    ],
    "no-fallthrough": "off",
    "@next/next/no-html-link-for-pages": "off",
  },
  parser: "@typescript-eslint/parser",
};
