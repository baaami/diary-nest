import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { FavoriteService } from './favorite.service';

@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}
  @Get(":id")

  // 관심 목록 리스트
  getFavoriteList(@Param("id", ParseIntPipe) userId: number) {
    console.log('hey')
    return this.favoriteService.getFavoriteList(userId)
  }
}
