"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const platform_express_1 = require("@nestjs/platform-express");
const typeorm_1 = require("@nestjs/typeorm");
const productimage_entity_1 = require("../../common/entities/productimage.entity");
const review_entity_1 = require("../review/entities/review.entity");
const user_entity_1 = require("./entities/user.entity");
const user_controller_1 = require("./user.controller");
const user_service_1 = require("./user.service");
const auth_shared_service_1 = require("../auth/auth.shared.service");
const profileimage_entity_1 = require("../../common/entities/profileimage.entity");
let UserModule = class UserModule {
};
UserModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.Users, productimage_entity_1.ProductImages, profileimage_entity_1.ProfileImages, review_entity_1.Reviews]),
            platform_express_1.MulterModule.register({
                dest: "./upload",
            }),
        ],
        controllers: [user_controller_1.UserController],
        providers: [user_service_1.UserService, jwt_1.JwtService, auth_shared_service_1.AuthSharedService],
    })
], UserModule);
exports.UserModule = UserModule;
//# sourceMappingURL=user.module.js.map