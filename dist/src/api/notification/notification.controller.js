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
exports.NotificationController = void 0;
const common_1 = require("@nestjs/common");
const notification_service_1 = require("./notification.service");
let NotificationController = class NotificationController {
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async getList(page = 0, userId) {
        try {
            if (isNaN(page))
                page = 0;
            const [notification_list, totalPage] = await this.notificationService.getNotificationListByUID(page, userId);
            const result = {
                notification_list,
                currentPage: page,
                totalPage,
            };
            return result;
        }
        catch (error) {
            console.error(error);
        }
    }
    async confirm(notification_id) {
        try {
            await this.notificationService.confirmNotification(notification_id);
        }
        catch (error) {
            console.error(error);
        }
    }
    async delete(notification_id) {
        try {
            await this.notificationService.deleteNotification(notification_id);
        }
        catch (error) {
            console.error(error);
        }
    }
};
__decorate([
    (0, common_1.Get)("/list/:id"),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getList", null);
__decorate([
    (0, common_1.HttpCode)(204),
    (0, common_1.Post)("/confirm/:id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "confirm", null);
__decorate([
    (0, common_1.HttpCode)(204),
    (0, common_1.Post)("/delete/:id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "delete", null);
NotificationController = __decorate([
    (0, common_1.Controller)("notification"),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], NotificationController);
exports.NotificationController = NotificationController;
//# sourceMappingURL=notification.controller.js.map