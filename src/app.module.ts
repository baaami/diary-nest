import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import * as ormconfig from "../ormconfig";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtMiddleWare } from "./middleware/jwt.middleware";
import { join } from "path";

import { ContentModule } from "./api/content/content.module";
import { AuthModule } from "./api/auth/auth.module";
import { UserModule } from "./api/user/user.module";
import { Users } from "./api/user/entities/user.entity";
import { EventsModule } from "./events/events.module";
import { Reviews } from "./api/review/entities/review.entity";
import { Favorites } from "./common/entities/favorite.entity";
import { ReviewModule } from "./api/review/review.module";
import { FavoriteModule } from "./api/favorite/favorite.module";
@Module({
  imports: [
    ContentModule,
    UserModule,
    AuthModule,
    ReviewModule,
    FavoriteModule,
    TypeOrmModule.forFeature([Users, Reviews, Favorites]),
    TypeOrmModule.forRoot(ormconfig),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "../../", "upload"),
      serveRoot: '/upload',
    }),
    EventsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer
    // .apply(JwtMiddleWare)
    // .forRoutes({
    //   path: 'content', // 특정 path 혹은 method에 대해서만 적용 시킬수도 있다.
    //   method: RequestMethod.ALL,
    // }, {
    //   path: 'user',
    //   method: RequestMethod.ALL,
    // })
  }
}
