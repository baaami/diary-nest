import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [],
  controllers: [ContentController],
  providers: [ContentService],
})

export class ContentModule {}
