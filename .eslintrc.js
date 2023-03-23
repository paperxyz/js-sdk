module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-paper`
  extends: ["paperxyz"],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
};
