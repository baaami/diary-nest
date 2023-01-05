import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';

@Module({
  imports: [
    MulterModule.register({
      dest: "./upload"
    })
  ],
  controllers: [ContentController],
  providers: [ContentService],
})

export class ContentModule {}
