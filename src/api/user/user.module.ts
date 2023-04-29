import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Images } from "src/common/entities/image.entity";
import { Reviews } from "src/api/review/entities/review.entity";
import { AuthService } from "../auth/auth.service";
import { Users } from "./entities/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Images, Reviews]),
    MulterModule.register({
      dest: "./upload",
    }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtService],
})
export class UserModule {}
