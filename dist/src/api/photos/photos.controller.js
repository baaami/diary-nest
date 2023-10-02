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
exports.PhotosController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const fs = require("fs");
const path = require("path");
let PhotosController = class PhotosController {
    async uploadPhotos(files) {
        const uploadFiles = [];
        for (const file of files) {
            const { buffer, originalname } = file;
            const parts = originalname.split('.');
            const ext = parts[parts.length - 1];
            const newName = 'upload/image_' + Date.now() + '.' + ext;
            const uploadPath = path.join(__dirname, '..', '..', '..', '..', newName);
            try {
                await fs.writeFile(uploadPath, buffer, (err) => {
                    if (err)
                        throw err;
                    console.log('The file has been saved!');
                });
            }
            catch (e) {
                console.log(e, '파일 저장 실패');
            }
            uploadFiles.push(newName);
        }
        return uploadFiles;
    }
};
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('photos')),
    __param(0, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], PhotosController.prototype, "uploadPhotos", null);
PhotosController = __decorate([
    (0, common_1.Controller)('photos')
], PhotosController);
exports.PhotosController = PhotosController;
//# sourceMappingURL=photos.controller.js.map