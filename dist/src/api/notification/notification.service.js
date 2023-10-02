"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const notification_entity_1 = require("./entity/notification.entity");
const typeorm_2 = require("typeorm");
const user_service_1 = require("../user/user.service");
const define_1 = require("../../common/define");
let NotificationService = class NotificationService {
    constructor(notificationRepository, userService) {
        this.notificationRepository = notificationRepository;
        this.userService = userService;
    }
    async getNotificationListByUID(page = 0, userId) {
        try {
            const receiver = await this.userService.findOne(userId);
            const notification_list = await this.notificationRepository
                .createQueryBuilder("notifications")
                .where({ receiver })
                .leftJoinAndSelect("notifications.receiver", "receiver")
                .leftJoinAndSelect("notifications.notifier", "notifier")
                .orderBy("notifications.id", "DESC")
                .skip(page != 0 ? page * define_1.pagenation_notification_size : 0)
                .take(define_1.pagenation_notification_size)
                .getManyAndCount();
            return notification_list;
        }
        catch (err) {
            console.error(err);
        }
    }
    async createNotification(createNotification) {
        try {
            await this.notificationRepository.save(createNotification);
        }
        catch (err) {
            console.error(err);
        }
    }
    async confirmNotification(confirm_id) {
        try {
            await this.notificationRepository.update({
                id: confirm_id,
            }, {
                confirmed: true,
            });
        }
        catch (err) {
            console.error(err);
        }
    }
    async deleteNotification(delete_id) {
        try {
            await this.notificationRepository.delete({
                id: delete_id,
            });
        }
        catch (err) {
            console.error(err);
        }
    }
};
NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notificaitions)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        user_service_1.UserService])
], NotificationService);
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map