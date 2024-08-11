import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { jwtConstants } from "./constant";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "src/api/user/entities/user.entity";
import { UserService } from "../user/user.service";
import { ProductImages } from "src/common/entities/productimage.entity";
import { AuthSharedService } from "./auth.shared.service";
import { ProfileImages } from "src/common/entities/profileimage.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, ProductImages, ProfileImages]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "60h" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, AuthSharedService],
  exports: [JwtModule],
})
export class AuthModule {}
