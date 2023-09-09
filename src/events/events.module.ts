import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat/chats.gateway";
import { ChatService } from "./chat/chat.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Rooms } from "./chat/entities/room.entity";
import { Chats } from "./chat/entities/chat.entity";
import { ChatController } from "./chat/chat.controller";
import { RoomService } from "src/api/room/rooms.service";

@Module({
  imports: [TypeOrmModule.forFeature([Rooms, Chats])],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService, RoomService],
  exports: [ChatGateway],
})
export class EventsModule {}
