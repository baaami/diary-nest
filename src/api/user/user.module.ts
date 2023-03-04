import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "./entities/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [UserController],
  providers: [UserService, JwtService],
})
export class UserModule {}
