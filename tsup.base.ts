import type { Options } from 'tsup';

/**
 * The shared bundle shape for the four Node applications.
 *
 * Why a bundler rather than `tsc` project references
 * --------------------------------------------------
 * Until now every package's `build` script was `tsc --noEmit`: a typecheck
 * wearing a build's name. Nothing emitted anything, `turbo.json` declared
 * `dist/**` outputs that no task produced, and the api and worker images ran
 * `tsx` against source in production. TypeScript was therefore transpiled at
 * every cold start, the whole source tree and the dev toolchain shipped inside
 * the runtime image, and nothing proved that the code being served was the code
 * that typechecked.
 *
 * The type gate stays exactly where it was: `typecheck` is still
 * `tsc --noEmit`, run by `pnpm verify` and by CI. This adds emission for the
 * four deployable entry points only.
 *
 * What is bundled and what is not
 * -------------------------------
 * Workspace packages are inlined. That is what makes this a four-file change
 * rather than a project-reference migration across fifteen packages: nothing in
 * `packages/**` needs to emit, because its code ends up inside the application
 * bundle that imports it. A per-package emit would buy nothing at run time and
 * cost a great deal of churn.
 *
 * Everything from npm stays external and is resolved from `node_modules` at run
 * time, exactly as it is today. Bundling third-party code would mean bundling
 * `@prisma/client`'s generated client, `sharp`'s native binding and
 * `@temporalio/core-bridge`'s Rust addon, none of which survive it. Keeping the
 * boundary at "ours is inlined, theirs is installed" also keeps the runtime
 * image auditable: `pnpm list --prod` still describes what is in it.
 *
 * Decorators
 * ----------
 * `apps/api` sets `emitDecoratorMetadata`, which Nest's dependency injection
 * needs and which esbuild cannot produce. tsup detects that tsconfig flag and
 * routes those files through SWC, which can. That is the reason this is tsup
 * and not a hand-rolled esbuild script.
 */

/**
 * Marks every bare specifier external except our own workspace packages.
 *
 * tsup's own `external` handling only covers packages listed in the app's
 * `package.json`. A transitive import — `pg` reaching in through
 * `@relay/database`, say — is not listed there and would otherwise be inlined,
 * silently duplicating a driver that has to be a singleton.
 */
function externalizeEveryNpmPackage(): NonNullable<Options['esbuildPlugins']>[number] {
  return {
    name: 'relay-externalize-npm',
    setup(build) {
      // Bare specifiers only: anything not starting with `.` or `/`. esbuild
      // compiles this filter with Go's regexp engine, which rejects the `u`
      // flag, so it is written without one.
      build.onResolve({ filter: /^[^./]/ }, (args) => {
        if (args.path.startsWith('@relay/')) {
          return null;
        }
        return { path: args.path, external: true };
      });
    },
  };
}

/** The build for one deployable app, given its entry file. */
export function nodeAppBundle(entry: string): Options {
  return {
    entry: { main: entry },
    outDir: 'dist',
    format: ['esm'],
    platform: 'node',
    target: 'node22',
    // One file, so the runtime image needs no chunk graph and a smoke test can
    // load the whole application with a single `node dist/main.mjs`.
    splitting: false,
    bundle: true,
    clean: true,
    // Types are the typecheck task's job; emitting them here would double the
    // build time for an artefact nothing consumes.
    dts: false,
    sourcemap: true,
    treeshake: true,
    noExternal: [/^@relay\//u],
    esbuildPlugins: [externalizeEveryNpmPackage()],
    outExtension: () => ({ js: '.mjs' }),
  };
}
