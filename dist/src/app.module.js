"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const serve_static_1 = require("@nestjs/serve-static");
const ormconfig = require("../ormconfig");
const typeorm_1 = require("@nestjs/typeorm");
const path_1 = require("path");
const content_module_1 = require("./api/content/content.module");
const auth_module_1 = require("./api/auth/auth.module");
const user_module_1 = require("./api/user/user.module");
const user_entity_1 = require("./api/user/entities/user.entity");
const events_module_1 = require("./events/events.module");
const review_entity_1 = require("./api/review/entities/review.entity");
const favorite_entity_1 = require("./common/entities/favorite.entity");
const review_module_1 = require("./api/review/review.module");
const favorite_module_1 = require("./api/favorite/favorite.module");
const room_module_1 = require("./api/room/room.module");
const photos_module_1 = require("./api/photos/photos.module");
const notification_module_1 = require("./api/notification/notification.module");
let AppModule = class AppModule {
    configure(consumer) {
    }
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            content_module_1.ContentModule,
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            review_module_1.ReviewModule,
            favorite_module_1.FavoriteModule,
            room_module_1.RoomModule,
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.Users, review_entity_1.Reviews, favorite_entity_1.Favorites]),
            typeorm_1.TypeOrmModule.forRoot(ormconfig),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, "../../", "upload"),
                serveRoot: "/upload",
            }),
            events_module_1.EventsModule,
            photos_module_1.PhotosModule,
            notification_module_1.NotificationModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map