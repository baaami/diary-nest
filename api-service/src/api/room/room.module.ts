import { Module } from "@nestjs/common";
import { RoomController } from "./room.controller";
import { RoomService } from "./rooms.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "../user/entities/user.entity";
import { ProfileImages } from "src/common/entities/profileimage.entity";
import { Rooms } from "src/events/chat/entities/room.entity";
import { Chats } from "src/events/chat/entities/chat.entity";
import { ChatService } from "src/events/chat/chat.service";

@Module({
  imports: [TypeOrmModule.forFeature([Rooms, Chats, Users, ProfileImages])],
  controllers: [RoomController],
  providers: [RoomService, ChatService],
})
export class RoomModule {}
