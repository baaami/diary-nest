import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Favorites } from "src/common/entities/favorite.entity";
import { Repository } from "typeorm";

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorites)
    private FavoriteRepository: Repository<Favorites>
  ) {}

  async getFavoriteList(userId: number) {
    const favorites = this.FavoriteRepository.createQueryBuilder("favorites")
    .select([
      'favorites.id',
      'contents.id',
      'contents.title',
      'contents.chat_cnt',
      'contents.like_cnt',
      'contents.createdAt',
      'contents.price',
      'contents.updatedAt'
    ])
    .innerJoin('favorites.content', 'contents')
    .innerJoin('favorites.user', 'users')
    .where('favorites.user_id = :userId', { userId })
    .getMany();
    return favorites
  }

  async insertFakerData(fakerdata: Favorites): Promise<Favorites> {
    const res = await this.FavoriteRepository.save(fakerdata);
    return res;
  }
}
