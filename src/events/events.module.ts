import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat/chats.gateway";
import { PushGateway } from "./push/push.gateway";

@Module({
  providers: [ChatGateway, PushGateway],
})
export class EventsModule {}
