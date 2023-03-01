import { Injectable, UseGuards } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { CreateImageDto } from 'src/common/dto/create-image.dto';
import { Images } from 'src/common/entities/image.entity';
import { Contents } from 'src/api/content/entities/content.entity';
import { InsertResult, UpdateResult, Repository, EntityManager } from 'typeorm';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { Users } from '../user/entities/user.entity';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Contents) private ContentRepository: Repository<Contents>,
    @InjectRepository(Images) private ImageRepository: Repository<Images>,
    @InjectEntityManager() private ContentManager: EntityManager,
  ) {}

  async findOne(contentId: number): Promise<Contents> {
    const content = await this.ContentRepository.createQueryBuilder('contents')
      .leftJoinAndSelect('contents.userId', 'user.id')
      .leftJoinAndSelect('contents.image', 'content')
      .where({ id: contentId })
      .getOne();

    return content;
  }

  async findList() {
    const content = await this.ContentRepository.createQueryBuilder('contents')
      .leftJoinAndSelect('contents.userId', 'user.id')
      .leftJoinAndSelect('contents.image', 'content')
      .getMany();

    return content;
  }

  async findUserList(userId: number) {
    const content = await this.ContentRepository.createQueryBuilder('contents')
      .leftJoinAndSelect('contents.userId', 'user.id')
      .where({ userId: userId })
      .getMany();

    return content;
  }

  async writeOne(
    createContentDto: CreateContentDto,
    user: Users,
  ): Promise<CreateContentDto & Contents> {
    createContentDto.userId = user.id;

    const content = await this.ContentRepository.save(createContentDto);
    return content;
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
    user: Users,
  ) {
    const { images } = files;

    createContentDto.userId = user.id;

    const content: Contents = await this.ContentRepository.save(
      createContentDto,
    );

    if (images) {
      images.forEach((image: Partial<CreateImageDto>) => {
        image.contentId = content.id;
        // 이미지 db에 저장
        this.ImageRepository.save(image);
      });
    } else {
      console.log('image not found');
    }

    return content;
  }

  async Update(
    updateContentDto: UpdateContentDto,
    contentId: number,
    files: { images?: Express.Multer.File[] },
  ): Promise<UpdateResult> {
    const content = await this.ContentRepository.update(
      { id: contentId },
      updateContentDto,
    );
    return content;
  }

  async DeleteOne(contentId: number) {
    const content = await this.ContentRepository.delete({ id: contentId });
    return content;
  }
}
