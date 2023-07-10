import { Module } from "@nestjs/common";
import { EventGateway } from "./events.gateway";
import { PushGateway } from "./push.gateway";

@Module({
  providers: [EventGateway, PushGateway],
})
export class EventsModule {}
