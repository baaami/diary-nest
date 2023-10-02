"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsModule = void 0;
const common_1 = require("@nestjs/common");
const chats_gateway_1 = require("./chat/chats.gateway");
const chat_service_1 = require("./chat/chat.service");
const typeorm_1 = require("@nestjs/typeorm");
const room_entity_1 = require("./chat/entities/room.entity");
const chat_entity_1 = require("./chat/entities/chat.entity");
const chat_controller_1 = require("./chat/chat.controller");
const rooms_service_1 = require("../api/room/rooms.service");
const notification_service_1 = require("../api/notification/notification.service");
const notification_entity_1 = require("../api/notification/entity/notification.entity");
const user_service_1 = require("../api/user/user.service");
const user_entity_1 = require("../api/user/entities/user.entity");
const profileimage_entity_1 = require("../common/entities/profileimage.entity");
const auth_shared_service_1 = require("../api/auth/auth.shared.service");
let EventsModule = class EventsModule {
};
EventsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                room_entity_1.Rooms,
                chat_entity_1.Chats,
                user_entity_1.Users,
                notification_entity_1.Notificaitions,
                profileimage_entity_1.ProfileImages,
            ]),
        ],
        controllers: [chat_controller_1.ChatController],
        providers: [
            chats_gateway_1.ChatGateway,
            chat_service_1.ChatService,
            rooms_service_1.RoomService,
            notification_service_1.NotificationService,
            user_service_1.UserService,
            auth_shared_service_1.AuthSharedService,
        ],
        exports: [chats_gateway_1.ChatGateway],
    })
], EventsModule);
exports.EventsModule = EventsModule;
//# sourceMappingURL=events.module.js.map