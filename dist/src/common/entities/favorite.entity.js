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
exports.Favorites = void 0;
const content_entity_1 = require("../../api/content/entities/content.entity");
const user_entity_1 = require("../../api/user/entities/user.entity");
const typeorm_1 = require("typeorm");
let Favorites = class Favorites {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "int", name: "id" }),
    __metadata("design:type", Number)
], Favorites.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.Users, (user) => user.favorites),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", user_entity_1.Users)
], Favorites.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => content_entity_1.Contents, (content) => content.favorites),
    (0, typeorm_1.JoinColumn)({ name: "content_id" }),
    __metadata("design:type", content_entity_1.Contents)
], Favorites.prototype, "content", void 0);
Favorites = __decorate([
    (0, typeorm_1.Entity)({ schema: "school", name: "favorites" })
], Favorites);
exports.Favorites = Favorites;
//# sourceMappingURL=favorite.entity.js.map