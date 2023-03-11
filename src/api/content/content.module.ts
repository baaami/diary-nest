import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Images } from "src/common/entities/image.entity";
import { ContentController } from "./content.controller";
import { ContentService } from "./content.service";
import { Contents } from "./entities/content.entity";
import { MulterModule } from "@nestjs/platform-express";
import { JwtService } from "@nestjs/jwt";
import { Users } from "../user/entities/user.entity";
import { Favorites } from "src/common/entities/favorite.entity";
import { Reviews } from "src/common/entities/review.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Contents, Images, Users, Favorites, Reviews]),
    MulterModule.register({
      dest: "./upload",
    }),
  ],
  controllers: [ContentController],
  providers: [ContentService, JwtService],
})
export class ContentModule {}
