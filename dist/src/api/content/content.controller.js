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
exports.ContentController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const auth_guard_1 = require("../../common/guard/auth.guard");
const multerOption_1 = require("../../lib/multer/multerOption");
const content_service_1 = require("./content.service");
const create_content_dto_1 = require("./dto/create-content.dto");
const update_content_dto_1 = require("./dto/update-content.dto");
let ContentController = class ContentController {
    constructor(contentService) {
        this.contentService = contentService;
    }
    async searchContentByKeyword(keyword, page = 0) {
        if (isNaN(page))
            page = 0;
        const [contents, totalPage] = await this.contentService.getListByKeyword(keyword, page);
        const result = {
            contents,
            totalPage,
        };
        return result;
    }
    async list(page = 0) {
        if (isNaN(page))
            page = 0;
        const [contents, totalPage] = await this.contentService.findList(page);
        const result = {
            contents,
            totalPage,
        };
        return result;
    }
    async sellingList(userId, page = 0) {
        if (isNaN(page))
            page = 0;
        const [contents, totalPage] = await this.contentService.getSellingProductsByUser(userId, page);
        const result = {
            contents,
            totalPage,
        };
        return result;
    }
    async soldList(userId, page = 0) {
        if (isNaN(page))
            page = 0;
        const [contents, totalPage] = await this.contentService.getSoldProductsByUser(userId, page);
        const result = {
            contents,
            totalPage,
        };
        return result;
    }
    async boughtList(userId, page = 0) {
        if (isNaN(page))
            page = 0;
        const [contents, totalPage] = await this.contentService.getBoughtProductList(userId, page);
        const result = {
            contents,
            totalPage,
        };
        return result;
    }
    async categoryList(category, page = 0) {
        if (isNaN(page))
            page = 0;
        const [contents, totalPage] = await this.contentService.getProductsByCategory(category, page);
        const result = {
            contents,
            totalPage,
        };
        return result;
    }
    read(contentId) {
        return this.contentService.findOne(contentId);
    }
    create(createContentDto, files) {
        return this.contentService.Create(createContentDto, files);
    }
    complete(contentId) {
        return this.contentService.complete(contentId);
    }
    write(createContentDto) {
        return this.contentService.writeOne(createContentDto);
    }
    update(updateContentDto, files, contentId) {
        return this.contentService.Update(updateContentDto, contentId, files);
    }
    delete(contentId) {
        return this.contentService.DeleteOne(contentId);
    }
};
__decorate([
    (0, common_1.Get)("/search"),
    __param(0, (0, common_1.Query)("keyword")),
    __param(1, (0, common_1.Query)("page")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "searchContentByKeyword", null);
__decorate([
    (0, common_1.Get)("/list"),
    __param(0, (0, common_1.Query)("page")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "list", null);
__decorate([
    (0, common_1.Get)("/list/user/selling/:id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)("page")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "sellingList", null);
__decorate([
    (0, common_1.Get)("/list/user/sold/:id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)("page")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "soldList", null);
__decorate([
    (0, common_1.Get)("/list/bought/:id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)("page")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "boughtList", null);
__decorate([
    (0, common_1.Get)("/list/category"),
    __param(0, (0, common_1.Query)("category")),
    __param(1, (0, common_1.Query)("page")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "categoryList", null);
__decorate([
    (0, common_1.Get)("/read/:id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ContentController.prototype, "read", null);
__decorate([
    (0, common_1.Post)("/create"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([{ name: "images", maxCount: 5 }], {
        storage: (0, multer_1.diskStorage)({
            destination: "./upload",
            filename: multerOption_1.editFileName,
        }),
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_content_dto_1.CreateContentDto, Object]),
    __metadata("design:returntype", void 0)
], ContentController.prototype, "create", null);
__decorate([
    (0, common_1.HttpCode)(204),
    (0, common_1.Post)("/complete/:id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ContentController.prototype, "complete", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_content_dto_1.CreateContentDto]),
    __metadata("design:returntype", void 0)
], ContentController.prototype, "write", null);
__decorate([
    (0, common_1.Patch)("/update/:id"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([{ name: "images", maxCount: 5 }], {
        storage: (0, multer_1.diskStorage)({
            destination: "./upload",
            filename: multerOption_1.editFileName,
        }),
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_content_dto_1.UpdateContentDto, Object, Number]),
    __metadata("design:returntype", void 0)
], ContentController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)("/delete/:id"),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ContentController.prototype, "delete", null);
ContentController = __decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)("content"),
    __metadata("design:paramtypes", [content_service_1.ContentService])
], ContentController);
exports.ContentController = ContentController;
//# sourceMappingURL=content.controller.js.map