import { NotificationService } from "./notification.service";
import { NotificationList } from "src/common/entities/common.entity";
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    getList(page: number, userId: number): Promise<NotificationList>;
    confirm(notification_id: number): Promise<void>;
    delete(notification_id: number): Promise<void>;
}
