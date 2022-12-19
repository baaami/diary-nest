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
    console.log("hello")
    const content = await this.ContentRepository.findOneBy({ "id": contentId });

    return content
  }

  async findList(userId: number) {
    const content = await this.ContentRepository
    .createQueryBuilder('contents')
    .leftJoinAndSelect('contents.userId', 'user.id')
    .getMany();

    return content 
  }

  async writeOne(createContentDto: CreateContentDto): Promise<InsertResult> {
    console.log(createContentDto)
    const content = await this.ContentRepository.insert(createContentDto);
    return content
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