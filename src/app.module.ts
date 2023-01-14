import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
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
import { JwtMiddleWare } from './middleware/jwt.middleware';
import { JwtService } from '@nestjs/jwt';
import { join } from 'path';
import { MulterModule } from '@nestjs/platform-express';
import { Images } from './common/entities/image.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Contents, Users, Images]),
    TypeOrmModule.forRoot(ormconfig),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'upload'),
    }),
    MulterModule.register({
      dest: './upload',
    }),
  ],
  controllers: [AuthController, UserController, ContentController],
  providers: [AuthService, UserService, ContentService, JwtMiddleWare,JwtService],
})
export class AppModule implements NestModule {
  // TODO : include or exclude 확인
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(JwtMiddleWare)
    .exclude({ path: 'auth', method: RequestMethod.ALL})
    .forRoutes({
      path: '*', // 특정 path 혹은 method에 대해서만 적용 시킬수도 있다.
      method: RequestMethod.ALL,           
    })
  }
}
