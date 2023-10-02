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
exports.ChatGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const define_1 = require("../../common/define");
const chat_service_1 = require("./chat.service");
const create_chat_dto_1 = require("./dto/create-chat.dto");
const rooms_service_1 = require("../../api/room/rooms.service");
const create_room_dto_1 = require("./dto/create-room.dto");
const notification_service_1 = require("../../api/notification/notification.service");
const create_notification_dto_1 = require("../../api/notification/dto/create-notification.dto");
let ChatGateway = class ChatGateway {
    constructor(chatService, roomService, notificationService) {
        this.chatService = chatService;
        this.roomService = roomService;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger("ChatGateway");
        this.clients = new Map();
        this.chat_clients = new Set();
    }
    getUserId(socketId) {
        return this.clients.get(socketId);
    }
    getSocketIdByUserId(userId) {
        for (const [sid, uid] of this.clients.entries()) {
            console.log("sid", sid);
            console.log("uid", uid);
            if (uid == String(userId))
                return sid;
        }
        return define_1.NOT_LOGIN_USER;
    }
    joinChattingRoom(userId, roomId) {
        this.logger.log(`${userId}번 님이 ${roomId}번 채팅방에 참가하셨습니다`);
        this.chat_clients.add(JSON.stringify({ userId, roomId }));
        console.log("채팅방 접속중인 client들", this.chat_clients);
    }
    leaveChattingRoom(userId, roomId) {
        this.logger.log(`${userId}번 님이 ${roomId}번 채팅방을 떠났습니다`);
        this.chat_clients.delete(JSON.stringify({ userId, roomId }));
    }
    IsNotJoinChatList(roomId) {
        if (roomId == define_1.UNKNOWN_ROOM_ID)
            return true;
        return false;
    }
    printConnectedClients() {
        for (const [key, value] of this.clients.entries()) {
            this.logger.log(`접속된 클라이언트: socket id: ${key}, user id: ${value}`);
        }
    }
    updateConfirmtiome(userId) {
        return "";
    }
    afterInit() {
        this.logger.log(`Initialize Web Socket Server [${define_1.CHAT_PORT}]`);
    }
    validationUserId(userId) {
        if (userId) {
            return true;
        }
        return false;
    }
    handleConnection(socket) {
        const socketId = socket.id;
        this.logger.log(`New connecting, socket id: ${socketId}`);
        this.clients.set(socketId, "");
        this.printConnectedClients();
    }
    handleDisconnect(socket) {
        const socketId = socket.id;
        this.logger.log(`Disconnecting, socket id: ${socketId}`);
        this.clients.delete(socket.id);
        this.printConnectedClients();
    }
    async handleLogin(socket, userId) {
        if (this.validationUserId(userId) == false) {
            this.logger.error(`userId is Invalid, userId: ${userId}`);
        }
        this.clients.set(socket.id, userId);
        console.log("login client id: ", userId);
        const joined_room_list = await this.chatService.getJoinedRoomList(Number(userId));
        console.log(`id: ${userId}, join room list`, joined_room_list);
        const joined_room_id_list = await Promise.all(joined_room_list.map((joined_room) => {
            return this.chatService.getRoomId(joined_room);
        }));
        socket.join(joined_room_id_list);
        socket.emit("login", `login success ${socket.id}: ${userId}`);
        this.printConnectedClients();
    }
    async handleLogout(socket, userId) {
        this.clients.delete(socket.id);
        const joined_room_list = await this.chatService.getJoinedRoomList(Number(userId));
        const joined_room_id_list = await Promise.all(joined_room_list.map((joined_room) => {
            return this.chatService.getRoomId(joined_room);
        }));
        joined_room_id_list.forEach((room_id) => {
            socket.leave(room_id);
        });
    }
    async handleJoinRoomEvent(socket, createRoomDto) {
        let room;
        room = await this.roomService.findExistRoom(createRoomDto);
        if (!room) {
            room = await this.roomService.createRoom(createRoomDto);
        }
        const userId = this.getUserId(socket.id);
        const roomId = String(room.id);
        await this.chatService.confirmChat(Number(userId), room);
        this.joinChattingRoom(userId, String(roomId));
        console.log("confirm_join_room에 userId 전송", userId);
        socket.to(roomId).emit("confirm_join_room", userId);
        const bSocketInRoom = socket.rooms.has(String(roomId));
        if (bSocketInRoom == false) {
            socket.join(String(roomId));
        }
        socket.emit("roomId_after_join_room", String(roomId));
        return;
    }
    async handleOutRoomEvent(socket, roomId) {
        const userId = this.getUserId(socket.id);
        this.leaveChattingRoom(userId, String(roomId));
        socket.emit("leave_room", `${userId}번 님이 ${roomId}번 채팅방을 떠났습니다`);
    }
    async handleLeaveRoomEvent(socket, roomId) {
        const userId = this.getUserId(socket.id);
        const room = await this.chatService.getRoomById(roomId);
        const sRoomId = String(roomId);
        const bSocketInRoom = socket.rooms.has(sRoomId);
        if (bSocketInRoom == true) {
            socket
                .to(sRoomId)
                .emit(`${userId}번 님이 ${roomId}번 채팅방을 나갔습니다`);
            socket.emit("delete_room", sRoomId);
            this.logger.log(`${userId}번 님이 ${roomId}번 채팅방을 나갔습니다`);
            socket.leave(sRoomId);
        }
        try {
            await this.chatService.leaveRoom(Number(userId), roomId);
            const IsLeaveAll = await this.chatService.IsLeaveAll(roomId);
            if (IsLeaveAll) {
                await this.chatService.deleteRoom(room);
            }
        }
        catch (err) {
            console.error(err);
        }
    }
    async handleMessageEvent(socket, msgPayload) {
        const userId = this.getUserId(socket.id);
        const roomId = await this.chatService.getRoomId(msgPayload.room);
        msgPayload.room.id = Number(roomId);
        const room = await this.chatService.getRoomById(Number(roomId));
        const partnerId = this.chatService.getChatPartner(userId, room);
        if (partnerId == define_1.UNKNOWN_USER) {
            this.logger.error(`Failed to getChatPartner Unknown User`);
        }
        const partnerSockertId = this.getSocketIdByUserId(partnerId);
        const message = Object.assign(Object.assign({}, msgPayload), { createdAt: new Date() });
        this.server.to(roomId).emit("message", message);
        if (partnerSockertId != define_1.NOT_LOGIN_USER) {
            console.log("partnerSockertId", partnerSockertId);
            this.server
                .to(String(partnerSockertId))
                .emit("chat_notification", message);
            console.log("파트너에게 채팅알림 전송");
        }
        else {
            this.logger.log(`${partnerId}번 님이 로그인 상태가 아닙니다.`);
        }
        try {
            await this.chatService.addMessage(msgPayload);
        }
        catch (err) {
            this.logger.error(`Failed to save messsage ${msgPayload.message}`);
        }
        await this.chatService.confirmChat(Number(userId), room);
        this.logger.log(`${userId} -> ${partnerId} : ${msgPayload.message}`);
        if (this.chat_clients.has(JSON.stringify({ userId: partnerId, roomId }))) {
            try {
                this.logger.log(`메시지: ${msgPayload.message}를 ${partnerId}가 읽었습니다.`);
                await this.chatService.confirmChat(Number(partnerId), room);
                this.server.to(roomId).emit("confirm_message", {
                    confirmTime: new Date(),
                    partnerId: partnerId,
                });
            }
            catch (err) {
                this.logger.error("Failed to update confirm chatting time");
            }
        }
        return;
    }
    async handlePrintConnectedUser(socket, roomId) {
        this.printConnectedClients();
    }
    async sendReviewNotification(seller, buyer, review) {
        let notification;
        try {
            notification = new create_notification_dto_1.CreateNotification();
            notification.type = define_1.NOTI_TYPE_REVIEW;
            notification.msg = review;
            notification.receiver = seller;
            notification.notifier = buyer;
            await this.notificationService.createNotification(notification);
        }
        catch (err) {
            console.error(err);
        }
        let socketId = "";
        for (const [key, value] of this.clients.entries()) {
            if (value == String(seller.id)) {
                socketId = key;
                break;
            }
        }
        if (!socketId && socketId.length == 0) {
            console.error(`seller(${seller.nickname}) dosen't connect socket [${socketId}]`);
            return;
        }
        this.server.to(socketId).emit("notification", {
            notification,
        });
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleConnection", null);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleDisconnect", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("login"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleLogin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("logout"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleLogout", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("join_room"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket,
        create_room_dto_1.CreateRoomDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleJoinRoomEvent", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("leave_room"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Number]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleOutRoomEvent", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("delete_room"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Number]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleLeaveRoomEvent", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("message"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket,
        create_chat_dto_1.CreateChatDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessageEvent", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("print_connected_user"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Number]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handlePrintConnectedUser", null);
ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(define_1.CHAT_PORT, {
        cors: {
            origin: "http://localhost:3000",
        },
    }),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        rooms_service_1.RoomService,
        notification_service_1.NotificationService])
], ChatGateway);
exports.ChatGateway = ChatGateway;
//# sourceMappingURL=chats.gateway.js.map