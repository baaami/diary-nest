import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductImages } from "src/common/entities/productimage.entity";
import { Reviews } from "src/api/review/entities/review.entity";
import { AuthService } from "../auth/auth.service";
import { Users } from "./entities/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { AuthSharedService } from "../auth/auth.shared.service";
import { ProfileImages } from "src/common/entities/profileimage.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, ProductImages, ProfileImages, Reviews]),
    MulterModule.register({
      dest: "./upload",
    }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtService, AuthSharedService],
})
export class UserModule {}
