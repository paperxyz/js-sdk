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
    "@typescript-eslint/require-await": "warn",
    "@typescript-eslint/no-misused-promises": "warn",
    "no-fallthrough": "off",
  },
  parser: "@typescript-eslint/parser",
};
