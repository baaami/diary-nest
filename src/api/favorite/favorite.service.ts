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

  async getFavoriteList(userId: number, page: number) {
    const favorites = this.FavoriteRepository.createQueryBuilder("favorites")
    .leftJoinAndSelect('favorites.content', 'contents')
    .leftJoinAndSelect('favorites.user', 'users')
    .where('favorites.user_id = :userId', { userId })
    .getMany();
    return favorites
  }

  async insertFakerData(fakerdata: Favorites): Promise<Favorites> {
    const res = await this.FavoriteRepository.save(fakerdata);
    return res;
  }
}
