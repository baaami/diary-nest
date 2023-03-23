import { Injectable, UseGuards } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { CreateImageDto } from "src/common/dto/create-image.dto";
import { Images } from "src/common/entities/image.entity";
import { Contents } from "src/api/content/entities/content.entity";
import { InsertResult, UpdateResult, Repository, EntityManager } from "typeorm";
import { CreateContentDto } from "./dto/create-content.dto";
import { UpdateContentDto } from "./dto/update-content.dto";
import { Users } from "../user/entities/user.entity";
import { pagenation_content_size } from "src/common/define";

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Contents) private ContentRepository: Repository<Contents>,
    @InjectRepository(Images) private ImageRepository: Repository<Images>,
    @InjectEntityManager() private ContentManager: EntityManager
  ) {}

  async findOne(contentId: number) {
    const content = await this.ContentRepository.createQueryBuilder("contents")
    .leftJoinAndSelect('contents.owner', 'users') 
    .leftJoinAndSelect('contents.images', 'images')
    .where({ id: contentId })
    .getOne();

    return content;
  }

  async findRandomOne(): Promise<Contents> {
    const contents = await this.ContentRepository.find({});
    const randomIndex = Math.floor(Math.random() * contents.length);
    return contents[randomIndex];
  }

  async findList(page: number) {
    const content = await this.ContentRepository.createQueryBuilder("contents")
    .leftJoinAndSelect('contents.owner', 'users') 
    .leftJoinAndSelect('contents.images', 'images')
    .skip(page * pagenation_content_size != 0 ? page * pagenation_content_size : 0)
    .take(pagenation_content_size)
    .getMany();

    return content;
  }
  
  async getSellingProductsByUser(userId: number, page: number) {
    const content = await this.ContentRepository.createQueryBuilder("contents")
      // .select(['contents.id', 'contents.title', 'contents.chat_cnt', 'contents.like_cnt', 'contents.createdAt'])
      .where('contents.owner_id = :userId AND contents.completed = :Completed', { userId, Completed: true })
      .skip(page * pagenation_content_size != 0 ? page * pagenation_content_size : 0)
      .take(pagenation_content_size)
      .getMany();

    return content;
  }

  async getSoldProductsByUser(userId: number, page: number) {
    const content = await this.ContentRepository.createQueryBuilder("contents")
      // .select(['contents.id', 'contents.title', 'contents.chat_cnt', 'contents.like_cnt', 'contents.createdAt'])
      .where('contents.owner_id = :userId AND contents.completed = :Completed', { userId, Completed: false })
      .skip(page * pagenation_content_size != 0 ? page * pagenation_content_size : 0)
      .take(pagenation_content_size)
      .getMany();

    return content;
  }

  async getProductsByCategory(category: string, page: number) {
    const content = await this.ContentRepository.createQueryBuilder("contents")
      .where('contents.category = :category', { category: category })
      .skip(page * pagenation_content_size != 0 ? page * pagenation_content_size : 0)
      .take(pagenation_content_size)
      .getMany();

    return content;
  }


  async writeOne(
    createContentDto: CreateContentDto,
    user: Users
  ): Promise<CreateContentDto & Contents> {
    createContentDto.owner = user;

    const content = await this.ContentRepository.save(createContentDto);
    return content;
  }

  async insertFakerData(fakerdata: Contents): Promise<Contents> {
    const res = await this.ContentRepository.save(fakerdata);
    return res;
  }

  async insertFakerImageData(fakerdata: Images): Promise<Images> {
    const res = await this.ContentRepository.save(fakerdata);
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
    files: { images?: Express.Multer.File[] },
    user: Users
  ) {
    const { images } = files;

    createContentDto.owner = user;

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
    console.log(content)
    return content;
  }

  async Update(
    updateContentDto: UpdateContentDto,
    contentId: number,
    files: { images?: Express.Multer.File[] }
  ): Promise<UpdateResult> {
    const content = await this.ContentRepository.update(
      { id: contentId },
      updateContentDto
    );
    return content;
  }

  async DeleteOne(contentId: number) {
    const content = await this.ContentRepository.delete({ id: contentId });
    return content;
  }
}
