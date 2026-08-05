#!/usr/bin/env -S node --experimental-strip-types --no-warnings

import { createFileConfigStore } from './config/store.js';
import { createFileCredentialStore } from './config/credentials.js';
import { runCli } from './program.js';

/**
 * The `relay` entrypoint.
 *
 * It wires the real file stores and the real environment, runs the program and
 * sets the exit code. Nothing else. The exit code is the API a wrapping script
 * depends on, so it is set here and only here.
 */

const result = await runCli(process.argv.slice(2), {
  configStore: createFileConfigStore(),
  credentialStore: createFileCredentialStore(),
  env: process.env,
});

process.exitCode = result.exitCode;
