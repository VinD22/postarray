import { Module } from '@nestjs/common';

import { ConnectionsController } from './connections.controller.js';
import { ConnectionsService } from './connections.service.js';
import { OAuthTransactionStore } from './oauth-transaction.store.js';

@Module({
  controllers: [ConnectionsController],
  providers: [ConnectionsService, OAuthTransactionStore],
})
export class ConnectionsModule {}
