import { Module } from '@nestjs/common';

import { OAuthDiscoveryController } from './discovery.controller.js';
import { OAuthProviderController } from './oauth-provider.controller.js';
import { OAuthProviderService } from './oauth-provider.service.js';

@Module({
  controllers: [OAuthProviderController, OAuthDiscoveryController],
  providers: [OAuthProviderService],
  exports: [OAuthProviderService],
})
export class OAuthProviderModule {}
