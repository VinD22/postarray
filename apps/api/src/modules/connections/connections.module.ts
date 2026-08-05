import { Module } from '@nestjs/common';

import { ConnectionsController } from './connections.controller';
import { ConnectionsService } from './connections.service';
import { OAuthTransactionStore } from './oauth-transaction.store';

@Module({
  controllers: [ConnectionsController],
  providers: [ConnectionsService, OAuthTransactionStore],
})
export class ConnectionsModule {}
