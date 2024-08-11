import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Reviews } from "src/api/review/entities/review.entity";
import { MulterModule } from "@nestjs/platform-express";
import { ReviewService } from "./review.service";
import { ReviewController } from "./review.controller";
import { Users } from "../user/entities/user.entity";
import { AuthService } from "../auth/auth.service";
import { JwtService } from "@nestjs/jwt";
import { AuthSharedService } from "../auth/auth.shared.service";
import { EventsModule } from "src/events/events.module";

@Module({
  imports: [EventsModule, TypeOrmModule.forFeature([Reviews, Users])],
  controllers: [ReviewController],
  providers: [ReviewService, AuthSharedService, JwtService],
})
export class ReviewModule {}
