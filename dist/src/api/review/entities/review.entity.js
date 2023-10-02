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
exports.Reviews = void 0;
const user_entity_1 = require("../../user/entities/user.entity");
const typeorm_1 = require("typeorm");
let Reviews = class Reviews {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "int", name: "id" }),
    __metadata("design:type", Number)
], Reviews.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("float", { name: "grade" }),
    __metadata("design:type", Number)
], Reviews.prototype, "grade", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "review", length: 2000 }),
    __metadata("design:type", String)
], Reviews.prototype, "review", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.Users, (buyer) => buyer.id),
    (0, typeorm_1.JoinColumn)({ name: "buyer_id" }),
    __metadata("design:type", user_entity_1.Users)
], Reviews.prototype, "buyer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.Users, (seller) => seller.id),
    (0, typeorm_1.JoinColumn)({ name: "seller_id" }),
    __metadata("design:type", user_entity_1.Users)
], Reviews.prototype, "seller", void 0);
Reviews = __decorate([
    (0, typeorm_1.Entity)({ schema: "school", name: "reviews" })
], Reviews);
exports.Reviews = Reviews;
//# sourceMappingURL=review.entity.js.map