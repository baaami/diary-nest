import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { NotificationList } from "src/common/entities/common.entity";

@Controller("notification")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get("/list/:id")
  async getList(
    @Query("page") page: number = 0,
    @Param("id", ParseIntPipe) userId: number
  ) {
    const [notification_list, totalPage] =
      await this.notificationService.getNotificationListByUID(page, userId);

    const result: NotificationList = {
      notification_list,
      currentPage: page,
      totalPage,
    };

    return result;
  }
}
