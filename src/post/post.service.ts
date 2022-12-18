import { Injectable } from '@nestjs/common';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  private posts: Post[] = [];

  getAll(): Post[] {
    // select Post list
    return this.posts;
  }

  getOne(id: number): Post {
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