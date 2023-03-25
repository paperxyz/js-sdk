import { defineConfig } from "tsup";

export default defineConfig((options) => {
  return {
    sourcemap: true,
    dts: true,
    clean: !options.watch,
    format: ["cjs", "esm"],
    minify: !options.watch,
    // Internal packages not meant for client consumption should be here
    noExternal: ["@paperxyz/sdk-common-utils"],
  };
});
