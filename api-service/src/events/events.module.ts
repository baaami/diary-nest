import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat/chats.gateway";
import { ChatService } from "./chat/chat.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Rooms } from "./chat/entities/room.entity";
import { Chats } from "./chat/entities/chat.entity";
import { ChatController } from "./chat/chat.controller";
import { RoomService } from "src/api/room/rooms.service";
import { NotificationService } from "src/api/notification/notification.service";
import { Notificaitions } from "src/api/notification/entity/notification.entity";
import { UserService } from "src/api/user/user.service";
import { Users } from "src/api/user/entities/user.entity";
import { ProfileImages } from "src/common/entities/profileimage.entity";
import { AuthSharedService } from "src/api/auth/auth.shared.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Rooms,
      Chats,
      Users,
      Notificaitions,
      ProfileImages,
    ]),
  ],
  controllers: [ChatController],
  providers: [
    ChatGateway,
    ChatService,
    RoomService,
    NotificationService,
    UserService,
    AuthSharedService,
  ],
  exports: [ChatGateway],
})
export class EventsModule {}
