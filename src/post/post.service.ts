import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from 'src/post/entities/post.entity';
import { InsertResult, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Posts) private ContentRepository: Repository<Posts>
  ) {}
  private posts: Posts[] = [];

  async findOne(postId: number): Promise<Posts> {
    console.log("hello")
    const post = await this.ContentRepository.findOneBy({ "id": postId });

    return post
  }

  async PostOne(createPostDto: CreatePostDto): Promise<InsertResult> {
    const post = await this.ContentRepository.insert(createPostDto);
    return post
  }

  getAll(): Posts[] {
    // select Post list
    return this.posts;
  }

  getOne(id: number): Posts {
    // select Post one
    const post = this.posts.find(post => post.id === id);
    return post
  }

  updateOne(id: number) {
    // update Post one
  }

  deleteOne(id: number) {
    // delete Post one
  }
}