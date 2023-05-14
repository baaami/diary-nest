import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Favorites } from "src/common/entities/favorite.entity";
import { Users } from "../user/entities/user.entity";
import { FavoriteController } from "./favorite.controller";
import { FavoriteService } from "./favorite.service";
import { Contents } from "../content/entities/content.entity";
import { UserService } from "../user/user.service";
import { ContentService } from "../content/content.service";
import { ProductImages } from "src/common/entities/productimage.entity";
import { JwtService } from "@nestjs/jwt";
import { AuthSharedService } from "../auth/auth.shared.service";
import { ProfileImages } from "src/common/entities/profileimage.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Favorites,
      Users,
      Contents,
      ProductImages,
      ProfileImages,
    ]),
  ],
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
