import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { FavoriteService } from './favorite.service';

@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}
  @Get(":id")

  // 관심 목록 리스트
  getFavoriteList(@Param("id", ParseIntPipe) userId: number, @Query() page: number = 0) {
    if(isNaN(page)) page = 0
    return this.favoriteService.getFavoriteList(userId, page)
  }
}
