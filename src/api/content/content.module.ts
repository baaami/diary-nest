import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductImages } from "src/common/entities/productimage.entity";
import { ContentController } from "./content.controller";
import { ContentService } from "./content.service";
import { Contents } from "./entities/content.entity";
import { MulterModule } from "@nestjs/platform-express";
import { JwtService } from "@nestjs/jwt";
import { Users } from "../user/entities/user.entity";
import { Favorites } from "src/common/entities/favorite.entity";
import { Reviews } from "src/api/review/entities/review.entity";
import { AuthSharedService } from "../auth/auth.shared.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Contents,
      ProductImages,
      Users,
      Favorites,
      Reviews,
    ]),
    MulterModule.register({
      dest: "./upload",
    }),
  ],
  controllers: [ContentController],
  providers: [ContentService, AuthSharedService, JwtService],
})
export class ContentModule {}
