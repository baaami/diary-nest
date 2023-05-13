import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { jwtConstants } from "./constant";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "src/api/user/entities/user.entity";
import { UserService } from "../user/user.service";
import { Images } from "src/common/entities/image.entity";
import { AuthSharedService } from "./auth.shared.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Images]),
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
