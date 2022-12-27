import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { AuthController } from './auth/auth.controller';
import { UserService } from './user/user.service';
import * as ormconfig from '../ormconfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentService } from './content/content.service';
import { ContentController } from './content/content.controller';
import { Contents } from './content/entities/content.entity';
import { Users } from './user/entities/user.entity';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Contents, Users]
    ),
    TypeOrmModule.forRoot(ormconfig),
    AuthModule,
    UserModule
  ],
  controllers: [ContentController, UserController, AuthController],
  providers: [ContentService, UserService, AuthService],
})
export class AppModule {}
 