import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { pagenation_content_size } from "src/common/define";
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
    .where('favorites.user_id = :userId', { userId })
    .leftJoinAndSelect('favorites.content', 'contents')
    .leftJoinAndSelect('contents.images', 'images')
    .skip(page * pagenation_content_size != 0 ? page * pagenation_content_size : 0)
    .take(pagenation_content_size)
    .getManyAndCount();
    return favorites
  }

  async insertFakerData(fakerdata: Favorites): Promise<Favorites> {
    const res = await this.FavoriteRepository.save(fakerdata);
    return res;
  }
}
