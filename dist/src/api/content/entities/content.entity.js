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
exports.Contents = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../user/entities/user.entity");
const productimage_entity_1 = require("../../../common/entities/productimage.entity");
const favorite_entity_1 = require("../../../common/entities/favorite.entity");
const class_validator_1 = require("class-validator");
let Contents = class Contents {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "int", name: "id" }),
    __metadata("design:type", Number)
], Contents.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)({ fulltext: true }),
    (0, typeorm_1.Column)("varchar", { name: "title", length: 100 }),
    __metadata("design:type", String)
], Contents.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Index)({ fulltext: true }),
    (0, typeorm_1.Column)("varchar", { name: "body", length: 2000 }),
    __metadata("design:type", String)
], Contents.prototype, "body", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "category", length: 100 }),
    __metadata("design:type", String)
], Contents.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", {
        name: "seller_completed",
        nullable: true,
        default: false,
    }),
    __metadata("design:type", Boolean)
], Contents.prototype, "seller_completed", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", {
        name: "buyer_completed",
        nullable: true,
        default: false,
    }),
    __metadata("design:type", Boolean)
], Contents.prototype, "buyer_completed", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "latitude", nullable: true }),
    __metadata("design:type", Number)
], Contents.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "longitude", nullable: true }),
    __metadata("design:type", Number)
], Contents.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "location", length: 100, nullable: true }),
    __metadata("design:type", String)
], Contents.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.Min)(0, { message: "Value must be at least 0" }),
    (0, class_validator_1.Max)(100000000, { message: "Value cannot exceed 100,000,000" }),
    (0, typeorm_1.Column)("int", { name: "price" }),
    __metadata("design:type", Number)
], Contents.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "like_cnt", default: 0 }),
    __metadata("design:type", Number)
], Contents.prototype, "like_cnt", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "like", default: false }),
    __metadata("design:type", Boolean)
], Contents.prototype, "like", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "chat_cnt", default: 0 }),
    __metadata("design:type", Number)
], Contents.prototype, "chat_cnt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Contents.prototype, "completed_date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.Users, (buyer) => buyer.id),
    (0, typeorm_1.JoinColumn)({ name: "buyer_id" }),
    __metadata("design:type", user_entity_1.Users)
], Contents.prototype, "buyer", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", {
        name: "university",
        length: 50,
        nullable: true,
        default: "한서대학교",
    }),
    __metadata("design:type", String)
], Contents.prototype, "university", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Contents.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Contents.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], Contents.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.Users, (user) => user.id),
    (0, typeorm_1.JoinColumn)({ name: "seller_id" }),
    __metadata("design:type", user_entity_1.Users)
], Contents.prototype, "seller", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => favorite_entity_1.Favorites, (favorite) => favorite.id),
    __metadata("design:type", Array)
], Contents.prototype, "favorites", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => productimage_entity_1.ProductImages, (image) => image.content),
    __metadata("design:type", Array)
], Contents.prototype, "images", void 0);
Contents = __decorate([
    (0, typeorm_1.Entity)({ schema: "school", name: "contents" })
], Contents);
exports.Contents = Contents;
//# sourceMappingURL=content.entity.js.map