import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoriteList } from 'src/common/entities/common.entity';

@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}
  
  // 특정 유저 관심 목록 리스트
  @Get(":id")
  async getFavoriteList(@Param("id", ParseIntPipe) userId: number, @Query('page') page: number = 0) {
    if(isNaN(page)) page = 0
    const [favorites, totalPage] = await this.favoriteService.getFavoriteList(userId, page)
    const result: FavoriteList = {
      favorites,
      totalPage
    }
    return result;
  }
}
