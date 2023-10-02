import { Notificaitions } from "./entity/notification.entity";
import { Repository } from "typeorm";
import { UserService } from "../user/user.service";
import { CreateNotification } from "./dto/create-notification.dto";
export declare class NotificationService {
    private notificationRepository;
    private readonly userService;
    constructor(notificationRepository: Repository<Notificaitions>, userService: UserService);
    getNotificationListByUID(page: number, userId: number): Promise<[Notificaitions[], number]>;
    createNotification(createNotification: CreateNotification): Promise<void>;
    confirmNotification(confirm_id: number): Promise<void>;
    deleteNotification(delete_id: number): Promise<void>;
}
