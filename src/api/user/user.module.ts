import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Reviews } from "src/common/entities/review.entity";
import { Users } from "./entities/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [TypeOrmModule.forFeature([Users, Reviews])],
  controllers: [UserController],
  providers: [UserService, JwtService],
})
export class UserModule {}
