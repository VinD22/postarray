import { Module } from '@nestjs/common';

import { ActorContextFactory } from '../common/actor-context.factory';
import { OAuthClientAuthenticator } from './client-authentication';
import { OAuthDiscoveryController } from './discovery.controller';
import { DynamicRegistrationService } from './dynamic-registration.service';
import { OAuthIntrospectionService } from './oauth-introspection.service';
import { OAuthProviderController } from './oauth-provider.controller';
import { OAuthProviderService } from './oauth-provider.service';
import { OAuthTokenController } from './oauth-token.controller';
import { OAuthTokenService } from './oauth-token.service';
import { OAuthRegistrationController } from './registration.controller';
import { OAuthResourceRegistry } from './resources';

@Module({
  controllers: [
    OAuthProviderController,
    OAuthTokenController,
    OAuthRegistrationController,
    OAuthDiscoveryController,
  ],
  providers: [
    ActorContextFactory,
    OAuthClientAuthenticator,
    OAuthResourceRegistry,
    OAuthProviderService,
    OAuthTokenService,
    OAuthIntrospectionService,
    DynamicRegistrationService,
  ],
  exports: [OAuthProviderService],
})
export class OAuthProviderModule {}
