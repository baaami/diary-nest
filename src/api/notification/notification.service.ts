import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Notificaitions } from "./entity/notification.entity";
import { Repository } from "typeorm";

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notificaitions)
    private NotificationRepository: Repository<Notificaitions>
  ) {}

  async getNotificationListByUID(userId: number): Promise<Notificaitions[]> {
    try {
    } catch (err) {
      console.error(err);
    }
    return;
  }

  async createNotification() {
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
