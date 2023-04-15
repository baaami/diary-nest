import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { pagenation_content_size } from "src/common/define";
import { Favorites } from "src/common/entities/favorite.entity";
import { Repository } from "typeorm";
import { Users } from "../user/entities/user.entity";
import { Contents } from "../content/entities/content.entity";
import { UserService } from "../user/user.service";
import { ContentService } from "../content/content.service";

@Injectable()
export class FavoriteService {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
    @Inject(ContentService)
    private readonly contentService: ContentService,
    @InjectRepository(Favorites)
    private FavoriteRepository: Repository<Favorites>,
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

  /**
   * @brief 관심 목록 추가 API
   * @param userId 로그인한 유저 ID
   * @param contentId 관심 목록에 추가할 게시물 ID
   * @returns 저장한 게시물 데이터
   */
  async addFavorite(userId: number, contentId: number) {
    const favorite = new Favorites();

    const user = await this.userService.findOne(userId);
    favorite.user = user;

    const content = await this.contentService.findOne(contentId);
    favorite.content = content;

    // 2. DB 저장
    const res = await this.FavoriteRepository.save(favorite);
    return 'Add Favorites ' + user.name + ' => ' + content.title;
  }

  /**
   * @brief 관심 목록 제거 API
   * @param loginUser 로그인한 유저
   * @param contentId 관심 목록에 추가할 게시물 ID
   * @returns 삭제한 관심목록 데이터
   */
  async delFavorite(loginUser: Users, contentId: number) {
    const res = await this.FavoriteRepository.delete(
      {
        user: loginUser,
        content: await this.contentService.findOne(contentId)
      }
    )
    return res
  }

  async insertFakerData(fakerdata: Favorites): Promise<Favorites> {
    const res = await this.FavoriteRepository.save(fakerdata);
    return res;
  }
}
