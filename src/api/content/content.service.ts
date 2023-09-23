import { HttpCode, Injectable, UseGuards } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { CreateProductImageDto } from "src/common/dto/create-product-image.dto";
import { ProductImages } from "src/common/entities/productimage.entity";
import { Contents } from "src/api/content/entities/content.entity";
import { InsertResult, UpdateResult, Repository, EntityManager } from "typeorm";
import { CreateContentDto } from "./dto/create-content.dto";
import { UpdateContentDto } from "./dto/update-content.dto";
import { Users } from "../user/entities/user.entity";
import { pagenation_content_size } from "src/common/define";
import { unlink, writeFileSync, readdirSync } from "fs";
import { join } from "path";
import { AuthSharedService } from "../auth/auth.shared.service";
import { Favorites } from "src/common/entities/favorite.entity";
import axios, { AxiosResponse } from "axios";
import { ProfileImages } from "src/common/entities/profileimage.entity";

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Contents) private ContentRepository: Repository<Contents>,
    @InjectRepository(ProductImages)
    private ProductImageRepository: Repository<ProductImages>,
    @InjectRepository(Favorites)
    private FavoriteRepository: Repository<Favorites>,
    private readonly authSharedService: AuthSharedService,
    @InjectEntityManager() private ContentManager: EntityManager
  ) {}

  async findOne(contentId: number) {
    const content = await this.ContentRepository.createQueryBuilder("contents")
      .leftJoinAndSelect("contents.seller", "seller")
      .leftJoinAndSelect("contents.buyer", "buyer")
      .leftJoinAndSelect("seller.profileImage", "sellerImages")
      .leftJoinAndSelect("contents.images", "contentImages")
      .where({ id: contentId })
      .getOne();

    const isLikeContent = await this.FavoriteRepository.createQueryBuilder(
      "favorites"
    )
      .where("favorites.content_id = :contentId", { contentId })
      .getCount();

    content.like = isLikeContent == 1 ? true : false;
    return content;
  }

  async findRandomOne(): Promise<Contents> {
    const contents = await this.ContentRepository.find({});
    const randomIndex = Math.floor(Math.random() * contents.length);
    return contents[randomIndex];
  }

  async updateFavoriteField(
    content_list_And_cnt: [Contents[], number]
  ): Promise<[Contents[], number]> {
    const [content_list, page_num] = content_list_And_cnt;
    const userId = this.authSharedService.getUser().id;

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

    return [content_list, page_num];
  }

  // [START] 상품 리스트 획득 API
  /**
   * 전체 상품 리스트를 획득 하는 API
   * @param page pagination 페이지
   * @returns 상품 리스트, 상품 리스트 개수
   */
  async findList(page: number): Promise<[Contents[], number]> {
    let res = await this.ContentRepository.createQueryBuilder("contents")
      .where("contents.seller_completed = :seller_completed", {
        seller_completed: false,
      })
      .leftJoinAndSelect("contents.seller", "seller")
      .leftJoinAndSelect("contents.images", "images")
      .skip(
        page * pagenation_content_size != 0 ? page * pagenation_content_size : 0
      )
      .take(pagenation_content_size)
      .getManyAndCount();

    if (this.authSharedService.getLogined()) {
      res = await this.updateFavoriteField(res);
    }

    return res;
  }

  async getListByKeyword(
    keyword: string,
    page: number
  ): Promise<[Contents[], number]> {
    let res = await this.ContentRepository.createQueryBuilder("contents")
      .where("MATCH (contents.title) AGAINST (:keyword IN BOOLEAN MODE)", {
        keyword: `*${keyword}*`,
      })
      .orWhere("MATCH (contents.body ) AGAINST (:keyword IN BOOLEAN MODE)", {
        keyword: `*${keyword}*`,
      })
      .skip(
        page * pagenation_content_size != 0 ? page * pagenation_content_size : 0
      )
      .take(pagenation_content_size)
      .getManyAndCount();

    if (this.authSharedService.getLogined()) {
      res = await this.updateFavoriteField(res);
    }

    return res;
  }

  /**
   * 특정 카테고리의 전체 상품 리스트를 획득 하는 API
   * @param category  카테고리
   * @param page      pagination 페이지
   * @returns         상품 리스트, 상품 리스트 개수
   */
  async getProductsByCategory(
    category: string,
    page: number
  ): Promise<[Contents[], number]> {
    let res = await this.ContentRepository.createQueryBuilder("contents")
      .where("contents.seller_completed = :seller_completed", {
        seller_completed: false,
      })
      .leftJoinAndSelect("contents.seller", "seller")
      .leftJoinAndSelect("contents.buyer", "buyer")
      .leftJoinAndSelect("contents.images", "images")
      .where("contents.category = :category", { category: category })
      .skip(
        page * pagenation_content_size != 0 ? page * pagenation_content_size : 0
      )
      .take(pagenation_content_size)
      .getManyAndCount();

    if (this.authSharedService.getLogined()) {
      res = await this.updateFavoriteField(res);
    }

    return res;
  }

  async getSellingProductsByUser(
    userId: number,
    page: number
  ): Promise<[Contents[], number]> {
    let res = await this.ContentRepository.createQueryBuilder("contents")
      // .select(['contents.id', 'contents.title', 'contents.chat_cnt', 'contents.like_cnt', 'contents.createdAt'])
      .leftJoinAndSelect("contents.seller", "seller")
      .leftJoinAndSelect("contents.buyer", "buyer")
      .leftJoinAndSelect("contents.images", "images")
      .where(
        "contents.seller_id = :userId AND contents.seller_completed = :Completed",
        { userId, Completed: false }
      )
      .skip(
        page * pagenation_content_size != 0 ? page * pagenation_content_size : 0
      )
      .take(pagenation_content_size)
      .getManyAndCount();

    if (this.authSharedService.getLogined()) {
      console.log(this.authSharedService.getUser());
      res = await this.updateFavoriteField(res);
    }

    return res;
  }

  async getSoldProductsByUser(
    userId: number,
    page: number
  ): Promise<[Contents[], number]> {
    let res = await this.ContentRepository.createQueryBuilder("contents")
      // .select(['contents.id', 'contents.title', 'contents.chat_cnt', 'contents.like_cnt', 'contents.createdAt'])
      .leftJoinAndSelect("contents.seller", "seller")
      .leftJoinAndSelect("contents.buyer", "buyer")
      .leftJoinAndSelect("contents.images", "images")
      .where(
        "contents.seller_id = :userId AND contents.seller_completed = :Completed",
        { userId, Completed: true }
      )
      .skip(
        page * pagenation_content_size != 0 ? page * pagenation_content_size : 0
      )
      .take(pagenation_content_size)
      .getManyAndCount();

    if (this.authSharedService.getLogined()) {
      res = await this.updateFavoriteField(res);
    }

    return res;
  }

  async getBoughtProductList(
    userId: number,
    page: number
  ): Promise<[Contents[], number]> {
    const buyer = this.authSharedService.getUser();
    let res = await this.ContentRepository.createQueryBuilder("contents")
      .leftJoinAndSelect("contents.seller", "seller")
      .leftJoinAndSelect("contents.buyer", "buyer")
      .leftJoinAndSelect("contents.images", "images")
      .where(
        "contents.buyer_id = :userId AND contents.buyer_completed = :Completed",
        { userId, Completed: true }
      )
      .skip(
        page * pagenation_content_size != 0 ? page * pagenation_content_size : 0
      )
      .take(pagenation_content_size)
      .getManyAndCount();

    if (this.authSharedService.getLogined()) {
      res = await this.updateFavoriteField(res);
    }

    return res;
  }
  // [END] 상품 리스트 획득 API

  async complete(contentId: number) {
    let IsSeller = false;

    const user = this.authSharedService.getUser();
    const find_content = await this.findOne(contentId);

    if (find_content.seller.id == user.id) {
      IsSeller = true;
    }

    if (IsSeller) {
      await this.ContentRepository.update(
        { id: contentId },
        {
          seller_completed: true,
          completed_date: new Date(),
        }
      );
    } else {
      await this.ContentRepository.update(
        { id: contentId },
        {
          buyer: user,
          buyer_completed: true,
          completed_date: new Date(),
        }
      );
    }
  }

  async writeOne(
    createContentDto: CreateContentDto
  ): Promise<CreateContentDto & Contents> {
    createContentDto.seller = this.authSharedService.getUser();

    const content = await this.ContentRepository.save(createContentDto);
    return content;
  }

  // [START] CRUD
  async Create(
    createContentDto: CreateContentDto,
    files: { images?: Express.Multer.File[] }
  ) {
    const { images } = files;
    console.log("Create files: ", files);

    createContentDto.seller = this.authSharedService.getUser();

    const content: Contents = await this.ContentRepository.save(
      createContentDto
    );

    if (images) {
      images.forEach((image: Partial<CreateProductImageDto>) => {
        image.content = content;
        this.ProductImageRepository.save(image);
      });
    } else {
      console.log("image not found");
    }

    return content;
  }

  @HttpCode(204)
  async Update(
    updateContentDto: UpdateContentDto,
    contentId: number,
    files: { images?: Express.Multer.File[] }
  ) {
    const { images } = files;
    console.log("Update files: ", files);

    try {
      const preContent = await this.ContentRepository.createQueryBuilder(
        "contents"
      )
        .where({ id: contentId })
        .getOne();

      // 업데이트할 content의 image를 서버에서 전부삭제
      const image_list = await this.ProductImageRepository.createQueryBuilder(
        "productimages"
      )
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
      await this.ProductImageRepository.delete({
        content: preContent,
      });

      // content table 갱신
      await this.ContentRepository.update({ id: contentId }, updateContentDto);

      const content = await this.ContentRepository.findOneBy({ id: contentId });

      images.forEach((image: Partial<CreateProductImageDto>) => {
        image.content = content;
        console.log("save image: ", image);
        this.ProductImageRepository.save(image);
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
      const image_list = await this.ProductImageRepository.createQueryBuilder(
        "productimages"
      )
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
      await this.ProductImageRepository.delete({
        content: content,
      });

      await this.ContentRepository.delete({ id: contentId });
    } catch (error) {
      console.error(error);
    }
  }
  // [END] CRUD

  // [For AUTO CREATE FAKER DATA]
  async findListAll() {
    const content_list = await this.ContentRepository.createQueryBuilder(
      "contents"
    )
      .leftJoinAndSelect("contents.seller", "users")
      .leftJoinAndSelect("contents.images", "images")
      .getMany();

    return content_list;
  }

  async findListImageIsNull() {
    const content_list = await this.ContentRepository.createQueryBuilder(
      "contents"
    )
      .leftJoinAndSelect("contents.seller", "users")
      .leftJoinAndSelect("contents.images", "images")
      .where("images.id IS NULL")
      .getMany();

    return content_list;
  }

  async insertFakerData(fakerdata: Contents): Promise<Contents> {
    const res = await this.ContentRepository.save(fakerdata);
    return res;
  }

  async insertFakerImageData(fakerdata: ProductImages): Promise<ProductImages> {
    const res = await this.ProductImageRepository.save(fakerdata);
    return res;
  }

  async getFakerImages(content: Contents): Promise<ProductImages[]> {
    const productImages: ProductImages[] = [];

    const image = new ProductImages();

    const dirContents = readdirSync("./upload/");
    const randomNum = Math.ceil(Math.random() * 100);
    image.path = `upload/${dirContents[randomNum]}`;
    image.content = content;

    try {
      await this.insertFakerImageData(image);
      productImages.push(image);
    } catch (err) {
      console.error("insertFakerImageData error", image);
    }

    return productImages;
  }
}
