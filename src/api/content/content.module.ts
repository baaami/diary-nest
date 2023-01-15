import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Images } from 'src/common/entities/image.entity';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { Contents } from './entities/content.entity';
import { MulterModule } from '@nestjs/platform-express';
@Module({
  imports: [
    TypeOrmModule.forFeature([Contents, Images]),
    MulterModule.register({
      dest: './upload',
    }),    
  ],
  controllers: [ContentController],
  providers: [ContentService],
})
export class ContentModule {}
