import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { AuthController } from './auth/auth.controller';
import { PostModule } from './post/post.module';
import { UserService } from './user/user.service';
import * as ormconfig from '../ormconfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from './post/post.service';
import { PostController } from './post/post.controller';
import { Posts } from './post/entities/post.entity';
import { Users } from './user/entities/user.entity';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Posts, Users]
    ),
    TypeOrmModule.forRoot(ormconfig)
  ],
  controllers: [PostController, UserController, AuthController],
  providers: [PostService, UserService, AuthService],
})
export class AppModule {}
