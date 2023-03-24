# Paper JS Monorepo

This guide explains how to Paper's JS Monorepo for development

Here's our current stack:

- 🏎 [Turborepo](https://turbo.build/repo) — High-performance build system for Monorepos
- 🛠 [Tsup](https://github.com/egoist/tsup) — TypeScript bundler powered by esbuild
- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Changesets](https://github.com/changesets/changesets) for managing versioning and changelogs
- [GitHub Actions](https://github.com/changesets/action) for fully automated package publishing

Hope you're as excited as I am!

The topics we'll be covering:

- Development
- Repository Layout
- Making
- Releasing

## Development

### Installation

- `git clone` the repository
- Run `yarn` at the top level of the repository
- Initialize the packages with `yarn build --filter=./packages/*`
- Go through `paper-web` ReadMe to complete the set-up

### To start developing

- `yarn dev` - Run all the packages locally
- `yarn dev-ews` - Run all packages needed to develop for the Paper embedded wallet service
- `yarn dev-checkout` - Run all packages needed to develop for Paper's checkout experience

You likely only use the latter two at any one time.

If your machine has a memory bottleneck, you can run a specific package at a time.

To run a specific package, say `paper-web`, run `yarn dev --filter=paper-web`. Replace `paper-web` with the repo name of your choice. [Read more on filtering task](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)

### Installing Packages

Most of the time you are installing packages in the specific repository itself.

To do so, simply navigate to that folder and run your regular `yarn add PACKAGE_NAME` or `yarn add -D PACKAGE_NAME`. Alternatively, you can run `yarn workspace REPO_NAME add -D PACKAGE_NAME` if you don't want to navigate to the folder of interest

If you need to install the package at the root level (you almost never want too), use the `-W` workspaces flag with `yarn add`.

### Other Useful Commands

- `yarn build` - Build all packages.
- `yarn lint` - Lint all packages.
- `yarn clean` - Clean up all `node_modules`, `dist` or `.next` folders (runs each package's clean script)
- `yarn changeset` - Generate a changeset for package release

## Repository Layout

This monorepo currently includes the following packages and applications:

- `apps/paper-web`: Main web app, linked to our private repo via git submodules
- `examples/embedded-wallet-service-sdk-demo-app`: Demo app using Paper's embedded wallet service SDK
- `packages/@paperxyz/embedded-wallet-service-sdk`: Client facing embedded wallet service SDK
- `packages/@paperxyz/sdk-common-utils`: Shared React utilities
- `packages/@paperxyz/tsconfig`: Shared `tsconfig.json`s used throughout the monorepo
- `packages/eslint-config-paperxyz`: ESLint preset

## Making Changes

### `paper-web`

Push directly to `paper-web`'s repository and make a PR for review.

### `/examples` folder

Create a new PR on this repo and wait for build to pass

### `/packages` folder

When adding a new file or function, ensure the component is also exported from the entry `index.tsx` file if it's meant to be exposed to some other clients.

```tsx:sdk-common-utils/src/index.tsx
export { ChainToPublicRpc, type Chain } from "./constants/blockchain";
// add more exports here
```

## Releasing

We use [Changesets](https://github.com/changesets/changesets) to manage versions, create changelogs, and publish to npm.

### Generating the Changelog

To generate your changelog, run `yarn changeset` anywhere in the repository:

1. **Which packages would you like to include?** – This shows the packages that have changed and remained the same. By default, no packages are included. Press `space` to select the packages you want to include in the `changeset`.
   - Note that you often only want to select packages from the `/packages` folder to create changelogs for
1. **Which packages should have a major bump?** – Press `space` to select the packages you want to bump versions for.
   - Press `Enter` without selecting anything to continue to the `minor` bump.
   - If doing the first major version, confirm you want to release.
1. Write a summary for the changes.
1. Confirm the changeset looks as expected.
1. A new Markdown file will be created in the `changeset` folder with the summary and a list of the packages included.
   - You can now go in and make more edits if needed

![release version](https://user-images.githubusercontent.com/44563205/227377619-8080c41a-89a6-4e27-be5b-d82920dcc13a.png)

### Compilation

To make the core library code work across all browsers, we need to compile the raw TypeScript and React code to plain JavaScript. We can accomplish this with `tsup`, which uses `esbuild` to greatly improve performance.

Running `pnpm build` from the root will run the `build` command defined in each package's `package.json` file.

The `build` command runs in parallel and caches & hashes the output to speed up future builds.

For `acme-core`, the `build` command is the following:

```bash
tsup src/index.tsx --format esm,cjs --dts --external react
```

`tsup` compiles `src/index.tsx`, which exports all of the components in the design system, into both ES Modules and CommonJS formats as well as their TypeScript types. The `package.json` for `acme-core` then instructs the consumer to select the correct format:

```json:acme-core/package.json
{
  "name": "@acme/core",
  "version": "0.0.0",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "sideEffects": false,
}
```

Run `pnpm build` to confirm compilation is working correctly. You should see a folder `acme-core/dist` which contains the compiled output.

```bash
acme-core
└── dist
    ├── index.d.ts  <-- Types
    ├── index.js    <-- CommonJS version
    └── index.mjs   <-- ES Modules version
```
