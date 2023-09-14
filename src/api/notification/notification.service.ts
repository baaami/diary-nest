import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Notificaitions } from "./entity/notification.entity";
import { Repository } from "typeorm";
import { UserService } from "../user/user.service";

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notificaitions)
    private notificationRepository: Repository<Notificaitions>,
    private readonly userService: UserService
  ) {}

  async getNotificationListByUID(userId: number): Promise<Notificaitions[]> {
    try {
      const receiver = await this.userService.findOne(userId);
      const notification_list = await this.notificationRepository.findBy({
        receiver,
      });

      return notification_list;
    } catch (err) {
      console.error(err);
    }
    return [];
  }

  async createNotification() {
    try {
    } catch (err) {
      console.error(err);
    }
  }

  async confirmNotification() {
    try {
    } catch (err) {
      console.error(err);
    }
  }

  async deleteNotification() {
    try {
    } catch (err) {
      console.error(err);
    }
  }
}
