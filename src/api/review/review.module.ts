import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm"
import { Reviews } from 'src/common/entities/review.entity';
import { MulterModule } from "@nestjs/platform-express";
import { ReviewService } from './review.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Reviews]),
      ],
      controllers: [],
      providers: [ReviewService],
})
export class ReviewModule {}
