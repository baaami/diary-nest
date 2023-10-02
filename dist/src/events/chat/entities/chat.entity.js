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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chats = void 0;
const typeorm_1 = require("typeorm");
const room_entity_1 = require("./room.entity");
let Chats = class Chats {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "int", name: "id" }),
    __metadata("design:type", Number)
], Chats.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "send_id" }),
    __metadata("design:type", Number)
], Chats.prototype, "send_id", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "message", length: 500 }),
    __metadata("design:type", String)
], Chats.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Chats.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => room_entity_1.Rooms, (room) => room.id),
    (0, typeorm_1.JoinColumn)({ name: "room_id" }),
    __metadata("design:type", room_entity_1.Rooms)
], Chats.prototype, "room", void 0);
Chats = __decorate([
    (0, typeorm_1.Entity)({ schema: "school", name: "chats" })
], Chats);
exports.Chats = Chats;
//# sourceMappingURL=chat.entity.js.map