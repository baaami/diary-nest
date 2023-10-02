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
exports.FavoriteService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const define_1 = require("../../common/define");
const favorite_entity_1 = require("../../common/entities/favorite.entity");
const typeorm_2 = require("typeorm");
const user_service_1 = require("../user/user.service");
const content_service_1 = require("../content/content.service");
const auth_shared_service_1 = require("../auth/auth.shared.service");
let FavoriteService = class FavoriteService {
    constructor(userService, contentService, FavoriteRepository, authSharedService) {
        this.userService = userService;
        this.contentService = contentService;
        this.FavoriteRepository = FavoriteRepository;
        this.authSharedService = authSharedService;
    }
    async getFavoriteList(userId, page) {
        let res = await this.FavoriteRepository.createQueryBuilder("favorites")
            .where("favorites.user_id = :userId", { userId })
            .leftJoinAndSelect("favorites.content", "contents")
            .leftJoinAndSelect("contents.images", "images")
            .skip(page * define_1.pagenation_content_size != 0 ? page * define_1.pagenation_content_size : 0)
            .take(define_1.pagenation_content_size)
            .getManyAndCount();
        const [favorite_list, count] = res;
        favorite_list.forEach((favorite) => {
            favorite.content.like = true;
        });
        res = [favorite_list, count];
        return res;
    }
    async addFavorite(contentId) {
        const favorite = new favorite_entity_1.Favorites();
        const loginedUser = this.authSharedService.getUser();
        const user = await this.userService.findOne(loginedUser.id);
        favorite.user = user;
        const content = await this.contentService.findOne(contentId);
        favorite.content = content;
        try {
            const res = await this.FavoriteRepository.save(favorite);
        }
        catch (err) {
            console.error(err);
            return {
                like_cnt: content.like_cnt,
            };
        }
        return {
            like_cnt: content.like_cnt + 1,
        };
    }
    async delFavorite(contentId) {
        const res = await this.FavoriteRepository.delete({
            content: await this.contentService.findOne(contentId),
        });
        return res;
    }
    async insertFakerData(fakerdata) {
        const res = await this.FavoriteRepository.save(fakerdata);
        return res;
    }
};
FavoriteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(user_service_1.UserService)),
    __param(1, (0, common_1.Inject)(content_service_1.ContentService)),
    __param(2, (0, typeorm_1.InjectRepository)(favorite_entity_1.Favorites)),
    __metadata("design:paramtypes", [user_service_1.UserService,
        content_service_1.ContentService,
        typeorm_2.Repository,
        auth_shared_service_1.AuthSharedService])
], FavoriteService);
exports.FavoriteService = FavoriteService;
//# sourceMappingURL=favorite.service.js.map