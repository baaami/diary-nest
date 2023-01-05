import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Contents } from 'src/content/entities/content.entity';
import { InsertResult, UpdateResult, Repository, EntityManager } from 'typeorm';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Contents) private ContentRepository: Repository<Contents>,
    @InjectEntityManager() private ContentManager: EntityManager
  ) {}

  async findOne(contentId: number): Promise<Contents> {
    const content = await this.ContentRepository
      .createQueryBuilder('contents')
      .leftJoinAndSelect('contents.userId', 'user.id')
      .where({"id": contentId})
      .getOne();
    return content
  }

  async findList() {
    const content = await this.ContentRepository
    .createQueryBuilder('contents')
    .leftJoinAndSelect('contents.userId', 'user.id')
    .getMany();

    return content 
  }

  async findUserList(userId: number) {
    const content = await this.ContentRepository
    .createQueryBuilder('contents')
    .leftJoinAndSelect('contents.userId', 'user.id')
    .where({'userId': userId})
    .getMany();

    return content 
  }

  async writeOne(createContentDto: CreateContentDto): Promise<InsertResult> {
    const content = await this.ContentRepository.insert(createContentDto);
    return content
  }

  async uploadFiles(files: {images?: Express.Multer.File[]}) {
    console.log("files: ", files )
  }

  async writeWithUploadFiles(createContentDto: CreateContentDto, files: Array<Express.Multer.File>) {
    const result = [];

    files.forEach((file) => {
      console.log("file: ", file)
      const res = {
        originalname: file.originalname,
        filename: file.filename
      };
      result.push(res);
    });
    
    // TODO : image path 받아오기
    const content = await this.ContentRepository.insert(createContentDto);
    return content

    return result;
  }

  async UpdateOne(updateContentDto: UpdateContentDto, contentId: number): Promise<UpdateResult> {
    const content = await this.ContentRepository.update({"id": contentId}, updateContentDto);
    return content
  }

  async DeleteOne(contentId: number) {
    const content = await this.ContentRepository.delete({"id": contentId})
    return content
  }
}