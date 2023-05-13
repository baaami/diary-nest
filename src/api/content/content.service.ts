import { HttpCode, Injectable, UseGuards } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { CreateImageDto } from "src/common/dto/create-image.dto";
import { Images } from "src/common/entities/image.entity";
import { Contents } from "src/api/content/entities/content.entity";
import { InsertResult, UpdateResult, Repository, EntityManager } from "typeorm";
import { CreateContentDto } from "./dto/create-content.dto";
import { UpdateContentDto } from "./dto/update-content.dto";
import { Users } from "../user/entities/user.entity";
import { pagenation_content_size } from "src/common/define";
import { unlink } from "fs";
import { join } from "path";
import { AuthSharedService } from "../auth/auth.shared.service";
import { Favorites } from "src/common/entities/favorite.entity";

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Contents) private ContentRepository: Repository<Contents>,
    @InjectRepository(Images) private ImageRepository: Repository<Images>,
    @InjectRepository(Favorites)
    private FavoriteRepository: Repository<Favorites>,
    private readonly authSharedService: AuthSharedService,
    @InjectEntityManager() private ContentManager: EntityManager
  ) {}

  async findOne(contentId: number) {
    const content = await this.ContentRepository.createQueryBuilder("contents")
      .leftJoinAndSelect("contents.owner", "users")
      .leftJoinAndSelect("contents.images", "images")
      .where({ id: contentId })
      .getOne();

    return content;
  }

  async findRandomOne(): Promise<Contents> {
    const contents = await this.ContentRepository.find({});
    const randomIndex = Math.floor(Math.random() * contents.length);
    return contents[randomIndex];
  }

  async findList(page: number): Promise<[Contents[], number]> {
    let res = await this.ContentRepository.createQueryBuilder("contents")
      .leftJoinAndSelect("contents.owner", "users")
      .leftJoinAndSelect("contents.images", "images")
      .skip(
        page * pagenation_content_size != 0 ? page * pagenation_content_size : 0
      )
      .take(pagenation_content_size)
      .getManyAndCount();

    // 로그인한 유저의 관심 목록 content id 획득
    if (this.authSharedService.getLogined()) {
      const userId = this.authSharedService.getUser().id;
      const [content_list, page_num] = res;

      // 로그인한 유저의 관심 목록 획득
      const favorite_content_list =
        await this.FavoriteRepository.createQueryBuilder("favorites")
          .select("favorites.content_id")
          .where("favorites.user_id = :userId", { userId })
          .getRawMany();

      const favoriteContentIdList = favorite_content_list.map(
        (favorite) => favorite.content_id
      );

      // 로그인한 유저의 관심 목록 like 설정
      content_list.forEach((content) => {
        if (favoriteContentIdList.includes(content.id)) {
          content.like = true;
        }
      });

      // 응답 body에 관심 목록을 설정한 리스트 할당
      res = [content_list, page_num];
    }

    return res;
  }

  async findListAll() {
    const content_list = await this.ContentRepository.createQueryBuilder(
      "contents"
    )
      .leftJoinAndSelect("contents.owner", "users")
      .leftJoinAndSelect("contents.images", "images")
      .getMany();

    return content_list;
  }

  async findListImageIsNull() {
    const content_list = await this.ContentRepository.createQueryBuilder(
      "contents"
    )
      .leftJoinAndSelect("contents.owner", "users")
      .leftJoinAndSelect("contents.images", "images")
      .where("images.id IS NULL")
      .getMany();

    return content_list;
  }

  async getSellingProductsByUser(userId: number, page: number) {
    const content_list = await this.ContentRepository.createQueryBuilder(
      "contents"
    )
      // .select(['contents.id', 'contents.title', 'contents.chat_cnt', 'contents.like_cnt', 'contents.createdAt'])
      .leftJoinAndSelect("contents.owner", "users")
      .leftJoinAndSelect("contents.images", "images")
      .where(
        "contents.owner_id = :userId AND contents.completed = :Completed",
        { userId, Completed: false }
      )
      .skip(
        page * pagenation_content_size != 0 ? page * pagenation_content_size : 0
      )
      .take(pagenation_content_size)
      .getManyAndCount();

    return content_list;
  }

  async getSoldProductsByUser(userId: number, page: number) {
    const content_list = await this.ContentRepository.createQueryBuilder(
      "contents"
    )
      // .select(['contents.id', 'contents.title', 'contents.chat_cnt', 'contents.like_cnt', 'contents.createdAt'])
      .leftJoinAndSelect("contents.owner", "users")
      .leftJoinAndSelect("contents.images", "images")
      .where(
        "contents.owner_id = :userId AND contents.completed = :Completed",
        { userId, Completed: true }
      )
      .skip(
        page * pagenation_content_size != 0 ? page * pagenation_content_size : 0
      )
      .take(pagenation_content_size)
      .getManyAndCount();

    return content_list;
  }

  async getProductsByCategory(category: string, page: number) {
    const content_list = await this.ContentRepository.createQueryBuilder(
      "contents"
    )
      .leftJoinAndSelect("contents.owner", "users")
      .leftJoinAndSelect("contents.images", "images")
      .where("contents.category = :category", { category: category })
      .skip(
        page * pagenation_content_size != 0 ? page * pagenation_content_size : 0
      )
      .take(pagenation_content_size)
      .getManyAndCount();

    return content_list;
  }

  async getBoughtProductList(page: number) {
    const user = this.authSharedService.getUser();
    const content_list = await this.ContentRepository.createQueryBuilder(
      "contents"
    )
      .leftJoinAndSelect("contents.buyer", "users")
      .leftJoinAndSelect("contents.images", "images")
      .where("contents.buyer_id = :buyerId", { buyerId: user.id })
      .skip(
        page * pagenation_content_size != 0 ? page * pagenation_content_size : 0
      )
      .take(pagenation_content_size)
      .getManyAndCount();
    return content_list;
  }

  async complete(contentId: number): Promise<UpdateResult> {
    const content = await this.ContentRepository.update(
      { id: contentId },
      {
        completed: true,
        completed_date: new Date(),
      }
    );
    return content;
  }
  async writeOne(
    createContentDto: CreateContentDto
  ): Promise<CreateContentDto & Contents> {
    createContentDto.owner = this.authSharedService.getUser();

    const content = await this.ContentRepository.save(createContentDto);
    return content;
  }

  async insertFakerData(fakerdata: Contents): Promise<Contents> {
    const res = await this.ContentRepository.save(fakerdata);
    return res;
  }

  async insertFakerImageData(fakerdata: Images): Promise<Images> {
    const res = await this.ImageRepository.save(fakerdata);
    return res;
  }

  async uploadFiles(files: { images?: Express.Multer.File[] }) {
    const result = [];
    const { images } = files;

    images.forEach((image: Partial<CreateImageDto>) => {
      // 이미지 db에 저장
      this.ImageRepository.save(image);
      result.push(image);
    });

    return result;
  }

  async Create(
    createContentDto: CreateContentDto,
    files: { images?: Express.Multer.File[] }
  ) {
    const { images } = files;

    createContentDto.owner = this.authSharedService.getUser();

    const content: Contents = await this.ContentRepository.save(
      createContentDto
    );

    if (images) {
      images.forEach((image: Partial<CreateImageDto>) => {
        image.content = content;
        this.ImageRepository.save(image);
      });
    } else {
      console.log("image not found");
    }
    console.log(content);
    return content;
  }

  @HttpCode(204)
  async Update(
    updateContentDto: UpdateContentDto,
    contentId: number,
    files: { images?: Express.Multer.File[] }
  ) {
    const { images } = files;

    try {
      const preContent = await this.ContentRepository.createQueryBuilder(
        "contents"
      )
        .where({ id: contentId })
        .getOne();

      // 업데이트할 content의 image를 서버에서 전부삭제
      const image_list = await this.ImageRepository.createQueryBuilder("images")
        .where({ content: preContent })
        .getMany();

      image_list.forEach((image) => {
        const deleteFilePath = join(__dirname, "../../../../", image.path);

        unlink(deleteFilePath, (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(`File ${deleteFilePath} has been deleted successfully.`);
        });
      });

      // 업데이트할 content의 image를 DB에서 전부삭제
      await this.ImageRepository.delete({
        content: preContent,
      });

      // content table 갱신
      await this.ContentRepository.update({ id: contentId }, updateContentDto);

      const content = await this.ContentRepository.findOneBy({ id: contentId });

      images.forEach((image: Partial<CreateImageDto>) => {
        image.content = content;
        this.ImageRepository.save(image);
      });
    } catch (error) {
      console.error(error);
    }
  }

  @HttpCode(204)
  async DeleteOne(contentId: number) {
    try {
      const content = await this.ContentRepository.createQueryBuilder(
        "contents"
      )
        .where({ id: contentId })
        .getOne();

      // 업데이트할 content의 image를 서버에서 전부삭제
      const image_list = await this.ImageRepository.createQueryBuilder("images")
        .where({ content: content })
        .getMany();

      image_list.forEach((image) => {
        const deleteFilePath = join(__dirname, "../../../../", image.path);

        unlink(deleteFilePath, (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(`File ${deleteFilePath} has been deleted successfully.`);
        });
      });

      // 업데이트할 content의 image를 DB에서 전부삭제
      await this.ImageRepository.delete({
        content: content,
      });

      await this.ContentRepository.delete({ id: contentId });
    } catch (error) {
      console.error(error);
    }
  }
}
