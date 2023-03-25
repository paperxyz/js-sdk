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
- `git submodule update --init --recursive` to clone `paper-web` (to be confirmed)
- Go through `paper-web` ReadMe to complete the set-up
- Run `yarn` at the top level of the repository
- Initialize the packages with `yarn build --filter=./packages/*`

### To start developing

- `yarn dev` - Run `paper-web` locally
- `yarn dev-ews` - Run all packages needed to develop for the Paper embedded wallet service
- `yarn dev-checkout` - Run all packages needed to develop for Paper's checkout experience

If your machine has a memory bottleneck, you can run a specific package at a time.

To run a specific package, say `@paperxyz/embedded-wallet-service-sdk`, run `yarn dev --filter=@paperxyz/embedded-wallet-service-sdk`. Replace `@paperxyz/embedded-wallet-service-sdk` with the repo name of your choice. [Read more on filtering task](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)

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
- `packages/@paperxyz/embedded-wallet-service-sdk` (published): Client facing embedded wallet service SDK
- `packages/@paperxyz/sdk-common-utilities`(published): Shared SDK utilities. Mostly typing and common functions.
- `packages/@paperxyz/tsconfig`: Shared `tsconfig.json` used throughout the monorepo
- `packages/eslint-config-paperxyz`: ESLint preset

## Making Changes

### `paper-web`

Push directly to `paper-web`'s repository and make a PR for review.

### `/examples` folder

Create a new PR on this repo and wait for build to pass

### `/packages` folder

When adding a new file or function, ensure the component is also exported from the entry `index.tsx` file if it's meant to be exposed to some other clients.

```tsx:sdk-common-utilities/src/index.tsx
export { ChainToPublicRpc, type Chain } from "./constants/blockchain";
// add more exports here
```

Note that if you are creating an internal package not meant to be published but is a dependency in other packages, you have to update `tsup.config.ts`.

In particular, add the bundle name under the `noExternal` setting so that it gets bundled appropriately in the client facing packages.

## Releasing

If you're simply making changes to the example repository, you should see something like the following

![regular release preview](https://user-images.githubusercontent.com/44563205/227390338-4ad76489-0d95-4c62-b4c0-d895836fbe0a.png)

If you are making changes to the folders in `/packages` itself and it's published (see the [repository layout](#repository-layout) section), you'll need to create a `changeset` in order to have it published to NPM.

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

Once you commit your changeset, you will see that the changeset has been detected and recognized.

![changeset detected](https://user-images.githubusercontent.com/44563205/227391045-aab3cfe0-458e-4a38-afa8-462b78d3c04e.png)

At this point, if you need to release a demo version to install it and/or test it elsewhere, head over to Github actions and run the `Release Snapshot` workflow on your branch.

![image](https://user-images.githubusercontent.com/44563205/227391365-b8a84295-a7e3-406d-ac8f-cf74ce2e5dec.png)

Otherwise, once things are done, you can merge your branch in. An new PR will automatically be created looking like the following:

![release version](https://user-images.githubusercontent.com/44563205/227377619-8080c41a-89a6-4e27-be5b-d82920dcc13a.png)

At this point, you can continue to make changes and add `changesets`. This PR will automatically be updated.

When you're ready to publish, simply merge the PR in and the packages will be automatically released to `npm`.
