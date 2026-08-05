import { Module } from '@nestjs/common';

import { RssController } from './rss.controller.js';
import { RssService } from './rss.service.js';

@Module({ controllers: [RssController], providers: [RssService] })
export class RssModule {}
