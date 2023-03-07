import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm"
import { Favorites } from 'src/common/entities/favorite.entity';
import { FavoriteService } from './favorite.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorites]),
  ],
  controllers: [],
  providers: [FavoriteService]
})
export class FavoriteModule {}
