import { Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service';

@Module({
  providers: [FavoriteService]
})
export class FavoriteModule {}
