import { Module } from '@nestjs/common';
import { PostController } from './post/post.controller';

@Module({
  imports: [],
  controllers: [PostController],
  providers: [],
})
export class AppModule {}
