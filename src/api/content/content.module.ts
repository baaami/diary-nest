import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Images } from 'src/common/entities/image.entity';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { Contents } from './entities/content.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Contents, Images]),
  ],
  controllers: [ContentController],
  providers: [ContentService],
})
export class ContentModule {}
