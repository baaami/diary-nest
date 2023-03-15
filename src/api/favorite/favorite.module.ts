import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Favorites } from "src/common/entities/favorite.entity";
import { Users } from "../user/entities/user.entity";
import { FavoriteController } from "./favorite.controller";
import { FavoriteService } from "./favorite.service";

@Module({
  imports: [TypeOrmModule.forFeature([Favorites, Users])],
  controllers: [FavoriteController],
  providers: [FavoriteService],
})
export class FavoriteModule {}
