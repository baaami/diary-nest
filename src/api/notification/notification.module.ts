import { Module } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Notificaitions } from "./entity/notification.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Notificaitions])],
  controllers: [],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
