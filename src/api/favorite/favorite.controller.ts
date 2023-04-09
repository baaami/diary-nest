import { Controller, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoriteList } from 'src/common/entities/common.entity';
import { Users } from '../user/entities/user.entity';
import { AuthGuard } from 'src/common/guard/auth.guard';

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

    // 특정 유저 관심 목록 추가
    @UseGuards(AuthGuard)
    @Post("/add/:id")
    async addFavorite(@Param("id", ParseIntPipe) contentId: number, @Req() req: any) {
      const res = await this.favoriteService.addFavorite((req.user as Users).id, contentId)
      return res;
    }
}
