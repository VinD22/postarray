import { Global, Module } from '@nestjs/common';

import { CredentialDirectory } from './credential-directory.js';

/**
 * The edge credential store, available everywhere.
 *
 * Global because the guards, the auth module, the OAuth server and the API key
 * module all need the same instance: two credential directories would mean two
 * views of what is revoked, and a revocation that only one of them can see.
 */
@Global()
@Module({ providers: [CredentialDirectory], exports: [CredentialDirectory] })
export class SecurityModule {}
