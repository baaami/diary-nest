"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const productimage_entity_1 = require("../../common/entities/productimage.entity");
const content_controller_1 = require("./content.controller");
const content_service_1 = require("./content.service");
const content_entity_1 = require("./entities/content.entity");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_1 = require("@nestjs/jwt");
const user_entity_1 = require("../user/entities/user.entity");
const favorite_entity_1 = require("../../common/entities/favorite.entity");
const review_entity_1 = require("../review/entities/review.entity");
const auth_shared_service_1 = require("../auth/auth.shared.service");
let ContentModule = class ContentModule {
};
ContentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                content_entity_1.Contents,
                productimage_entity_1.ProductImages,
                user_entity_1.Users,
                favorite_entity_1.Favorites,
                review_entity_1.Reviews,
            ]),
            platform_express_1.MulterModule.register({
                dest: "./upload",
            }),
        ],
        controllers: [content_controller_1.ContentController],
        providers: [content_service_1.ContentService, auth_shared_service_1.AuthSharedService, jwt_1.JwtService],
    })
], ContentModule);
exports.ContentModule = ContentModule;
//# sourceMappingURL=content.module.js.map