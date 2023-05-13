import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Favorites } from "src/common/entities/favorite.entity";
import { Users } from "../user/entities/user.entity";
import { FavoriteController } from "./favorite.controller";
import { FavoriteService } from "./favorite.service";
import { Contents } from "../content/entities/content.entity";
import { UserService } from "../user/user.service";
import { ContentService } from "../content/content.service";
import { Images } from "src/common/entities/image.entity";
import { JwtService } from "@nestjs/jwt";
import { AuthSharedService } from "../auth/auth.shared.service";

@Module({
  imports: [TypeOrmModule.forFeature([Favorites, Users, Contents, Images])],
  controllers: [FavoriteController],
  providers: [
    FavoriteService,
    UserService,
    ContentService,
    AuthSharedService,
    JwtService,
  ],
})
export class FavoriteModule {}
