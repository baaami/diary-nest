"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const favorite_entity_1 = require("../../common/entities/favorite.entity");
const user_entity_1 = require("../user/entities/user.entity");
const favorite_controller_1 = require("./favorite.controller");
const favorite_service_1 = require("./favorite.service");
const content_entity_1 = require("../content/entities/content.entity");
const user_service_1 = require("../user/user.service");
const content_service_1 = require("../content/content.service");
const productimage_entity_1 = require("../../common/entities/productimage.entity");
const jwt_1 = require("@nestjs/jwt");
const auth_shared_service_1 = require("../auth/auth.shared.service");
const profileimage_entity_1 = require("../../common/entities/profileimage.entity");
let FavoriteModule = class FavoriteModule {
};
FavoriteModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                favorite_entity_1.Favorites,
                user_entity_1.Users,
                content_entity_1.Contents,
                productimage_entity_1.ProductImages,
                profileimage_entity_1.ProfileImages,
            ]),
        ],
        controllers: [favorite_controller_1.FavoriteController],
        providers: [
            favorite_service_1.FavoriteService,
            user_service_1.UserService,
            content_service_1.ContentService,
            auth_shared_service_1.AuthSharedService,
            jwt_1.JwtService,
        ],
    })
], FavoriteModule);
exports.FavoriteModule = FavoriteModule;
//# sourceMappingURL=favorite.module.js.map