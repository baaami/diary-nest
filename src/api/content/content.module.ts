import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Images } from 'src/common/entities/image.entity';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { Contents } from './entities/content.entity';
import { MulterModule } from '@nestjs/platform-express';
import { JwtService } from '@nestjs/jwt';
import { Users } from '../user/entities/user.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Contents, Images, Users]),
    MulterModule.register({
      dest: './upload',
    }),    
  ],  
  controllers: [ContentController],
  providers: [ContentService, JwtService],
})
export class ContentModule {}
