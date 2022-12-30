import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
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
import { JwtMiddleWare } from './middleware/jwt.middleware';
import { ContentModule } from './content/content.module';

@Module({
  imports: [
    AuthModule,
    ContentModule,
    TypeOrmModule.forFeature(
      [Contents, Users]
    ),
    TypeOrmModule.forRoot(ormconfig),
  ],
  controllers: [],
  providers: [],
})

export class AppModule implements NestModule {
  // TODO : include or exclude 확인
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(JwtMiddleWare)
    .exclude({ path: 'auth', method: RequestMethod.ALL})
  }
}
