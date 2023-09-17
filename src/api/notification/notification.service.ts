import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Notificaitions } from "./entity/notification.entity";
import { Repository } from "typeorm";
import { UserService } from "../user/user.service";
import { CreateNotification } from "./dto/create-notification.dto";
import { pagenation_notification_size } from "src/common/define";

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notificaitions)
    private notificationRepository: Repository<Notificaitions>,
    private readonly userService: UserService
  ) {}

  async getNotificationListByUID(
    page: number = 0,
    userId: number
  ): Promise<[Notificaitions[], number]> {
    try {
      const receiver = await this.userService.findOne(userId);

      const notification_list = await this.notificationRepository
        .createQueryBuilder("notifications")
        .where({ receiver })
        .leftJoinAndSelect("notifications.receiver", "receiver")
        .leftJoinAndSelect("notifications.notifier", "notifier")
        .orderBy("notifications.id", "DESC")
        .skip(page != 0 ? page * pagenation_notification_size : 0)
        .take(pagenation_notification_size)
        .getManyAndCount();

      return notification_list;
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * @brief 알림 데이터 삽입
   *
   * @param createNotification  생성할 알림 데이터
   */
  async createNotification(createNotification: CreateNotification) {
    try {
      await this.notificationRepository.save(createNotification);
    } catch (err) {
      console.error(err);
    }
  }

  async confirmNotification(confirm_id: number) {
    try {
      await this.notificationRepository.update(
        {
          id: confirm_id,
        },
        {
          confirmed: true,
        }
      );
    } catch (err) {
      console.error(err);
    }
  }

  async deleteNotification(delete_id: number) {
    try {
      await this.notificationRepository.delete({
        id: delete_id,
      });
    } catch (err) {
      console.error(err);
    }
  }
}
