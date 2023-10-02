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
exports.Rooms = void 0;
const typeorm_1 = require("typeorm");
const chat_entity_1 = require("./chat.entity");
let Rooms = class Rooms {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "int", name: "id" }),
    __metadata("design:type", Number)
], Rooms.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "content_id" }),
    __metadata("design:type", Number)
], Rooms.prototype, "content_id", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "seller_id" }),
    __metadata("design:type", Number)
], Rooms.prototype, "seller_id", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "buyer_id" }),
    __metadata("design:type", Number)
], Rooms.prototype, "buyer_id", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "seller_out" }),
    __metadata("design:type", Boolean)
], Rooms.prototype, "seller_out", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "buyer_out" }),
    __metadata("design:type", Boolean)
], Rooms.prototype, "buyer_out", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp", { name: "seller_confirm_time" }),
    __metadata("design:type", Date)
], Rooms.prototype, "seller_confirm_time", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp", { name: "buyer_confirm_time" }),
    __metadata("design:type", Date)
], Rooms.prototype, "buyer_confirm_time", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => chat_entity_1.Chats, (chat) => chat.id),
    __metadata("design:type", Array)
], Rooms.prototype, "chats", void 0);
Rooms = __decorate([
    (0, typeorm_1.Entity)({ schema: "school", name: "rooms" })
], Rooms);
exports.Rooms = Rooms;
//# sourceMappingURL=room.entity.js.map