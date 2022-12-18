import { Module } from '@nestjs/common';
import { PostController } from './post/post.controller';
import { UserController } from './user/user.controller';
import { AuthController } from './auth/auth.controller';
import { PostModule } from './post/post.module';

@Module({
  imports: [PostModule],
  controllers: [UserController, AuthController],
  providers: [],
})
export class AppModule {}
