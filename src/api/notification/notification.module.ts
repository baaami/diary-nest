import { Module } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Notificaitions } from "./entity/notification.entity";
import { UserService } from "../user/user.service";
import { Users } from "../user/entities/user.entity";
import { ProfileImages } from "src/common/entities/profileimage.entity";
import { AuthSharedService } from "../auth/auth.shared.service";
import { NotificationController } from "./notification.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Notificaitions, Users, ProfileImages])],
  controllers: [NotificationController],
  providers: [NotificationService, UserService, AuthSharedService],
  exports: [NotificationService],
})
export class NotificationModule {}
