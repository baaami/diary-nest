import {
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from "@nestjs/common";
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
    try {
      const [notification_list, totalPage] =
        await this.notificationService.getNotificationListByUID(page, userId);

      const result: NotificationList = {
        notification_list,
        currentPage: page,
        totalPage,
      };

      return result;
    } catch (error) {
      console.error(error);
    }
  }

  @HttpCode(204)
  @Post("/confirm/:id")
  async confirm(@Param("id", ParseIntPipe) notification_id: number) {
    try {
      await this.notificationService.confirmNotification(notification_id);
    } catch (error) {
      console.error(error);
    }
  }

  @HttpCode(204)
  @Post("/delete/:id")
  async delete(@Param("id", ParseIntPipe) notification_id: number) {
    try {
      await this.notificationService.deleteNotification(notification_id);
    } catch (error) {
      console.error(error);
    }
  }
}
