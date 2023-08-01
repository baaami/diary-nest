import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat/chats.gateway";
import { PushGateway } from "./push/push.gateway";
import { ChatService } from "./chat/chat.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Rooms } from "./chat/entities/room.entity";
import { Chats } from "./chat/entities/chat.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Rooms, Chats])],
  providers: [ChatGateway, PushGateway, ChatService],
})
export class EventsModule {}
