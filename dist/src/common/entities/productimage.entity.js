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
exports.ProductImages = void 0;
const typeorm_1 = require("typeorm");
const content_entity_1 = require("../../api/content/entities/content.entity");
let ProductImages = class ProductImages {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "int", name: "id" }),
    __metadata("design:type", Number)
], ProductImages.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "path", length: 100, nullable: true }),
    __metadata("design:type", String)
], ProductImages.prototype, "path", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ProductImages.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ProductImages.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => content_entity_1.Contents, (content) => content.images),
    (0, typeorm_1.JoinColumn)({ name: "content_id" }),
    __metadata("design:type", content_entity_1.Contents)
], ProductImages.prototype, "content", void 0);
ProductImages = __decorate([
    (0, typeorm_1.Entity)({ schema: "school", name: "productimages" })
], ProductImages);
exports.ProductImages = ProductImages;
//# sourceMappingURL=productimage.entity.js.map