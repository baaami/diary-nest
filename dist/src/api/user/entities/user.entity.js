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
exports.Users = void 0;
const typeorm_1 = require("typeorm");
const content_entity_1 = require("../../content/entities/content.entity");
const class_validator_1 = require("class-validator");
const review_entity_1 = require("../../review/entities/review.entity");
const favorite_entity_1 = require("../../../common/entities/favorite.entity");
const profileimage_entity_1 = require("../../../common/entities/profileimage.entity");
let Users = class Users {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "int", name: "id" }),
    __metadata("design:type", Number)
], Users.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "name", length: 20, nullable: true }),
    __metadata("design:type", String)
], Users.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Users.prototype, "birth", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "nickname", length: 20, nullable: true }),
    __metadata("design:type", String)
], Users.prototype, "nickname", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "email", length: 100 }),
    __metadata("design:type", String)
], Users.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, typeorm_1.Column)("varchar", { name: "password", length: 100, nullable: true }),
    __metadata("design:type", String)
], Users.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "university", length: 50, nullable: true }),
    __metadata("design:type", String)
], Users.prototype, "university", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "gender", nullable: true }),
    __metadata("design:type", Number)
], Users.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)("float", { name: "latitude", nullable: true }),
    __metadata("design:type", Number)
], Users.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)("float", { name: "longitude", nullable: true }),
    __metadata("design:type", Number)
], Users.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "location", length: 100, nullable: true }),
    __metadata("design:type", String)
], Users.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)("float", { name: "grade", nullable: true }),
    __metadata("design:type", Number)
], Users.prototype, "grade", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Users.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Users.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], Users.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => review_entity_1.Reviews, (review) => review.id),
    __metadata("design:type", Array)
], Users.prototype, "reviews", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => favorite_entity_1.Favorites, (favorite) => favorite.id),
    __metadata("design:type", Array)
], Users.prototype, "favorites", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => content_entity_1.Contents, (content) => content.seller),
    __metadata("design:type", content_entity_1.Contents)
], Users.prototype, "contents", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => profileimage_entity_1.ProfileImages, (image) => image.user),
    (0, typeorm_1.JoinColumn)({ name: "profile_image_id" }),
    __metadata("design:type", profileimage_entity_1.ProfileImages)
], Users.prototype, "profileImage", void 0);
Users = __decorate([
    (0, typeorm_1.Entity)({ schema: "school", name: "users" })
], Users);
exports.Users = Users;
//# sourceMappingURL=user.entity.js.map