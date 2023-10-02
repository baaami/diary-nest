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
exports.PushGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const define_1 = require("../../common/define");
let PushGateway = class PushGateway {
    constructor() {
        this.logger = new common_1.Logger("PushGateway");
        this.notifications = [];
        this.clients = new Map();
    }
    afterInit() {
        this.logger.log(`Initialize Web Socket Server [${define_1.PUSH_PORT}]`);
    }
    handleConnection(socket) {
        this.logger.log(`${socket.id} 소켓 연결`);
    }
    handleDisconnect(socket) {
        this.logger.log(`${socket.id} 소켓 연결 해제 ❌`);
        this.clients.delete(socket.id);
    }
    handleSubscribeNotifications(socket, userId) {
        this.clients.set(socket.id, userId);
        socket.emit("subscribed", "알림 구독 완료");
    }
    handleSendNotification(socket, notification) {
        socket.emit("notificationReceived", notification);
    }
};
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], PushGateway.prototype, "handleConnection", null);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], PushGateway.prototype, "handleDisconnect", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("login"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], PushGateway.prototype, "handleSubscribeNotifications", null);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], PushGateway.prototype, "handleSendNotification", null);
PushGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(define_1.PUSH_PORT, {
        cors: {
            origin: "http://localhost:3000",
        },
    })
], PushGateway);
exports.PushGateway = PushGateway;
//# sourceMappingURL=push.gateway.js.map