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
import { ChatGateway } from "src/events/chat/chats.gateway";
import { ChatService } from "src/events/chat/chat.service";
import { RoomService } from "../room/rooms.service";
import { Chats } from "src/events/chat/entities/chat.entity";
import { Rooms } from "src/events/chat/entities/room.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Reviews, Users, Chats, Rooms])],
  controllers: [ReviewController],
  providers: [
    ReviewService,
    AuthSharedService,
    JwtService,
    ChatGateway,
    ChatService,
    RoomService,
  ],
})
export class ReviewModule {}
