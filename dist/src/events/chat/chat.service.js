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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const chat_entity_1 = require("./entities/chat.entity");
const room_entity_1 = require("./entities/room.entity");
const define_1 = require("../../common/define");
const rooms_service_1 = require("../../api/room/rooms.service");
let ChatService = class ChatService {
    constructor(RoomRepository, ChatRepository, roomService) {
        this.RoomRepository = RoomRepository;
        this.ChatRepository = ChatRepository;
        this.roomService = roomService;
    }
    async getRoomId(room) {
        let target_room;
        try {
            target_room = await this.roomService.findExistRoom(room);
        }
        catch (err) {
            console.error(err);
        }
        if (target_room == null) {
            target_room = await this.roomService.createRoom(room);
        }
        return String(target_room.id);
    }
    async getRoomById(id) {
        let target_room;
        try {
            target_room = await this.RoomRepository.findOneBy({
                id,
            });
        }
        catch (err) {
            console.error(err);
        }
        return target_room;
    }
    async getJoinedRoomList(userId) {
        let room_list = await this.RoomRepository.find({
            where: [
                {
                    buyer_id: userId,
                },
                {
                    seller_id: userId,
                },
            ],
        });
        const result_room_list = room_list.filter((target_room) => {
            const userType = this.getUserType(target_room, userId);
            if (userType == define_1.SELLER) {
                if (target_room.seller_out == false)
                    return true;
            }
            else if (userType == define_1.BUYER) {
                if (target_room.buyer_out == false)
                    return true;
            }
            else {
                console.error("Unknown User Type");
            }
            return false;
        });
        return result_room_list;
    }
    async getRoomInfo(roomId) {
        const target_room = await this.RoomRepository.findOneBy({
            id: roomId,
        });
        return target_room;
    }
    async getChatList(page = 0, roomId) {
        let res;
        try {
            res = await this.ChatRepository.createQueryBuilder("chats")
                .leftJoinAndSelect("chats.room", "room")
                .where("room.id = :roomId", { roomId })
                .orderBy("chats.id", "DESC")
                .skip(page * define_1.pagenation_chat_size != 0 ? page * define_1.pagenation_chat_size : 0)
                .take(define_1.pagenation_chat_size)
                .getManyAndCount();
        }
        catch (err) {
            console.error(err);
        }
        return res;
    }
    async getChatLatest(roomId) {
        let res;
        try {
            res = await this.ChatRepository.createQueryBuilder("chats")
                .leftJoinAndSelect("chats.room", "room")
                .where("room.id = :roomId", { roomId })
                .orderBy("chats.createdAt", "DESC")
                .getOne();
        }
        catch (err) {
            console.error(err);
        }
        return res;
    }
    getChatPartner(userId, room) {
        const userType = this.getUserType(room, Number(userId));
        if (userType == define_1.SELLER) {
            return room.buyer_id;
        }
        else if (userType == define_1.BUYER) {
            return room.seller_id;
        }
        return define_1.UNKNOWN_USER;
    }
    async addMessage(msgPayload) {
        try {
            this.ChatRepository.save(msgPayload);
        }
        catch (err) {
            console.error(err);
        }
    }
    async updateConfirmTime(roomId, memberType) {
        try {
            if (memberType == define_1.SELLER) {
                this.RoomRepository.update({ id: roomId }, {
                    seller_confirm_time: new Date(),
                });
                console.log('seller confirmTime업데이트');
            }
            else {
                this.RoomRepository.update({ id: roomId }, {
                    buyer_confirm_time: new Date(),
                });
                console.log('buyer confirmTime업데이트');
            }
        }
        catch (err) {
            console.error(err);
        }
    }
    getUserType(room, userId) {
        if (userId == room.buyer_id) {
            return define_1.BUYER;
        }
        else if (userId == room.seller_id) {
            return define_1.SELLER;
        }
        return define_1.UNKNOWN_USER;
    }
    async confirmChat(userId, room) {
        const clientType = this.getUserType(room, userId);
        if (clientType == define_1.UNKNOWN_USER) {
            console.error("Failed to join room unknown user", userId);
            return;
        }
        await this.updateConfirmTime(room.id, clientType);
    }
    async IsLeaveAll(roomId) {
        const room = await this.getRoomById(roomId);
        if (room.buyer_out && room.seller_out)
            return true;
        else
            return false;
    }
    async leaveRoom(userId, roomId) {
        try {
            const room = await this.getRoomById(roomId);
            if (room.buyer_id == userId) {
                await this.RoomRepository.update({
                    id: roomId,
                }, Object.assign(Object.assign({}, room), { buyer_out: true }));
            }
            else {
                await this.RoomRepository.update({
                    id: roomId,
                }, Object.assign(Object.assign({}, room), { seller_out: true }));
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    async deleteRoom(room) {
        try {
            await this.ChatRepository.delete({
                room,
            });
            await this.RoomRepository.delete({
                id: room.id,
            });
            console.log(`Success to Delete Room [${room.id}]`);
        }
        catch (err) {
            console.error(err);
        }
    }
};
ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(room_entity_1.Rooms)),
    __param(1, (0, typeorm_1.InjectRepository)(chat_entity_1.Chats)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        rooms_service_1.RoomService])
], ChatService);
exports.ChatService = ChatService;
//# sourceMappingURL=chat.service.js.map