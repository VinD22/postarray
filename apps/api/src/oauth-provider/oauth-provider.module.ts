import { Module } from '@nestjs/common';

import { OAuthDiscoveryController } from './discovery.controller';
import { OAuthProviderController } from './oauth-provider.controller';
import { OAuthProviderService } from './oauth-provider.service';

@Module({
  controllers: [OAuthProviderController, OAuthDiscoveryController],
  providers: [OAuthProviderService],
  exports: [OAuthProviderService],
})
export class OAuthProviderModule {}
