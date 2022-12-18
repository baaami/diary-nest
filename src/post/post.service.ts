import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from 'src/post/entities/post.entity';
import { InsertResult, UpdateResult, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Posts) private ContentRepository: Repository<Posts>
  ) {}

  async findOne(postId: number): Promise<Posts> {
    console.log("hello")
    const post = await this.ContentRepository.findOneBy({ "id": postId });

    return post
  }

  async PostOne(createPostDto: CreatePostDto): Promise<InsertResult> {
    const post = await this.ContentRepository.insert(createPostDto);
    return post
  }

  async UpdateOne(updatePostDto: UpdatePostDto, postId: number): Promise<UpdateResult> {
    const post = await this.ContentRepository.update({"id": postId}, updatePostDto);
    return post
  }

  async DeleteOne(postId: number) {
    const post = await this.ContentRepository.delete({"id": postId})
    return post
  }
}