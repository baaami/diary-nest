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
exports.ContentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const productimage_entity_1 = require("../../common/entities/productimage.entity");
const content_entity_1 = require("./entities/content.entity");
const typeorm_2 = require("typeorm");
const update_content_dto_1 = require("./dto/update-content.dto");
const define_1 = require("../../common/define");
const fs_1 = require("fs");
const path_1 = require("path");
const auth_shared_service_1 = require("../auth/auth.shared.service");
const favorite_entity_1 = require("../../common/entities/favorite.entity");
let ContentService = class ContentService {
    constructor(ContentRepository, ProductImageRepository, FavoriteRepository, authSharedService, ContentManager) {
        this.ContentRepository = ContentRepository;
        this.ProductImageRepository = ProductImageRepository;
        this.FavoriteRepository = FavoriteRepository;
        this.authSharedService = authSharedService;
        this.ContentManager = ContentManager;
    }
    async findOne(contentId) {
        try {
            const content = await this.ContentRepository.createQueryBuilder("contents")
                .leftJoinAndSelect("contents.seller", "seller")
                .leftJoinAndSelect("contents.buyer", "buyer")
                .leftJoinAndSelect("seller.profileImage", "sellerImages")
                .leftJoinAndSelect("contents.images", "contentImages")
                .where({ id: contentId })
                .getOne();
            const isLikeContent = await this.FavoriteRepository.createQueryBuilder("favorites")
                .where("favorites.content_id = :contentId", { contentId })
                .getCount();
            content.like = isLikeContent == 1 ? true : false;
            return content;
        }
        catch (err) {
            console.log(err);
        }
    }
    async findRandomOne() {
        try {
            const contents = await this.ContentRepository.find({});
            const randomIndex = Math.floor(Math.random() * contents.length);
            return contents[randomIndex];
        }
        catch (err) {
            console.log(err);
        }
    }
    async updateFavoriteField(content_list_And_cnt) {
        const [content_list, page_num] = content_list_And_cnt;
        const userId = this.authSharedService.getUser().id;
        try {
            const favorite_content_list = await this.FavoriteRepository.createQueryBuilder("favorites")
                .select("favorites.content_id")
                .where("favorites.user_id = :userId", { userId })
                .getRawMany();
            const favoriteContentIdList = favorite_content_list.map((favorite) => favorite.content_id);
            content_list.forEach((content) => {
                if (favoriteContentIdList.includes(content.id)) {
                    content.like = true;
                }
            });
            return [content_list, page_num];
        }
        catch (err) {
            console.log(err);
        }
    }
    async findList(page) {
        const user = this.authSharedService.getUser();
        let university = "";
        if (!user) {
            university = define_1.DEFAULT_UNIVERSITY;
        }
        else {
            university = user.university;
        }
        try {
            let res = await this.ContentRepository.createQueryBuilder("contents")
                .where("contents.seller_completed = :seller_completed", {
                seller_completed: false,
            })
                .andWhere("contents.university = :university", {
                university,
            })
                .leftJoinAndSelect("contents.seller", "seller")
                .leftJoinAndSelect("contents.images", "images")
                .skip(page * define_1.pagenation_content_size != 0
                ? page * define_1.pagenation_content_size
                : 0)
                .take(define_1.pagenation_content_size)
                .getManyAndCount();
            if (this.authSharedService.getLogined()) {
                res = await this.updateFavoriteField(res);
            }
            return res;
        }
        catch (err) {
            console.log(err);
        }
    }
    async getListByKeyword(keyword, page) {
        try {
            let res = await this.ContentRepository.createQueryBuilder("contents")
                .where("MATCH (contents.title) AGAINST (:keyword IN BOOLEAN MODE)", {
                keyword: `*${keyword}*`,
            })
                .orWhere("MATCH (contents.body ) AGAINST (:keyword IN BOOLEAN MODE)", {
                keyword: `*${keyword}*`,
            })
                .skip(page * define_1.pagenation_content_size != 0
                ? page * define_1.pagenation_content_size
                : 0)
                .take(define_1.pagenation_content_size)
                .getManyAndCount();
            if (this.authSharedService.getLogined()) {
                res = await this.updateFavoriteField(res);
            }
            return res;
        }
        catch (err) {
            console.log(err);
        }
    }
    async getProductsByCategory(category, page) {
        const user = this.authSharedService.getUser();
        let university = "";
        if (!user) {
            university = define_1.DEFAULT_UNIVERSITY;
        }
        else {
            university = user.university;
        }
        try {
            let res = await this.ContentRepository.createQueryBuilder("contents")
                .where("contents.seller_completed = :seller_completed", {
                seller_completed: false,
            })
                .andWhere("contents.university = :university", {
                university,
            })
                .leftJoinAndSelect("contents.seller", "seller")
                .leftJoinAndSelect("contents.buyer", "buyer")
                .leftJoinAndSelect("contents.images", "images")
                .where("contents.category = :category", { category: category })
                .skip(page * define_1.pagenation_content_size != 0
                ? page * define_1.pagenation_content_size
                : 0)
                .take(define_1.pagenation_content_size)
                .getManyAndCount();
            if (this.authSharedService.getLogined()) {
                res = await this.updateFavoriteField(res);
            }
            return res;
        }
        catch (err) {
            console.log(err);
        }
    }
    async getSellingProductsByUser(userId, page) {
        try {
            let res = await this.ContentRepository.createQueryBuilder("contents")
                .leftJoinAndSelect("contents.seller", "seller")
                .leftJoinAndSelect("contents.buyer", "buyer")
                .leftJoinAndSelect("contents.images", "images")
                .where("contents.seller_id = :userId AND contents.seller_completed = :Completed", { userId, Completed: false })
                .skip(page * define_1.pagenation_content_size != 0
                ? page * define_1.pagenation_content_size
                : 0)
                .take(define_1.pagenation_content_size)
                .getManyAndCount();
            if (this.authSharedService.getLogined()) {
                console.log(this.authSharedService.getUser());
                res = await this.updateFavoriteField(res);
            }
            return res;
        }
        catch (err) {
            console.log(err);
        }
    }
    async getSoldProductsByUser(userId, page) {
        try {
            let res = await this.ContentRepository.createQueryBuilder("contents")
                .leftJoinAndSelect("contents.seller", "seller")
                .leftJoinAndSelect("contents.buyer", "buyer")
                .leftJoinAndSelect("contents.images", "images")
                .where("contents.seller_id = :userId AND contents.seller_completed = :Completed", { userId, Completed: true })
                .skip(page * define_1.pagenation_content_size != 0
                ? page * define_1.pagenation_content_size
                : 0)
                .take(define_1.pagenation_content_size)
                .getManyAndCount();
            if (this.authSharedService.getLogined()) {
                res = await this.updateFavoriteField(res);
            }
            return res;
        }
        catch (err) {
            console.log(err);
        }
    }
    async getBoughtProductList(userId, page) {
        try {
            let res = await this.ContentRepository.createQueryBuilder("contents")
                .leftJoinAndSelect("contents.seller", "seller")
                .leftJoinAndSelect("contents.buyer", "buyer")
                .leftJoinAndSelect("contents.images", "images")
                .where("contents.buyer_id = :userId AND contents.buyer_completed = :Completed", { userId, Completed: true })
                .skip(page * define_1.pagenation_content_size != 0
                ? page * define_1.pagenation_content_size
                : 0)
                .take(define_1.pagenation_content_size)
                .getManyAndCount();
            if (this.authSharedService.getLogined()) {
                res = await this.updateFavoriteField(res);
            }
            return res;
        }
        catch (err) {
            console.log(err);
        }
    }
    async complete(contentId) {
        let IsSeller = false;
        const user = this.authSharedService.getUser();
        const find_content = await this.findOne(contentId);
        if (find_content.seller.id == user.id) {
            IsSeller = true;
        }
        if (IsSeller) {
            await this.ContentRepository.update({ id: contentId }, {
                seller_completed: true,
                completed_date: new Date(),
            });
        }
        else {
            await this.ContentRepository.update({ id: contentId }, {
                buyer: user,
                buyer_completed: true,
                completed_date: new Date(),
            });
        }
    }
    async writeOne(createContentDto) {
        createContentDto.seller = this.authSharedService.getUser();
        try {
            const content = await this.ContentRepository.save(createContentDto);
            return content;
        }
        catch (err) {
            console.log(err);
        }
    }
    async Create(createContentDto, files) {
        const { images } = files;
        console.log("Create files: ", files);
        createContentDto.seller = this.authSharedService.getUser();
        createContentDto.university = createContentDto.seller.university;
        try {
            const content = await this.ContentRepository.save(createContentDto);
            if (images) {
                images.forEach((image) => {
                    image.content = content;
                    this.ProductImageRepository.save(image);
                });
            }
            else {
                console.log("image not found");
            }
            return content;
        }
        catch (err) {
            console.log(err);
        }
    }
    async Update(updateContentDto, contentId, files) {
        const { images } = files;
        console.log("Update files: ", files);
        try {
            const preContent = await this.ContentRepository.createQueryBuilder("contents")
                .where({ id: contentId })
                .getOne();
            const image_list = await this.ProductImageRepository.createQueryBuilder("productimages")
                .where({ content: preContent })
                .getMany();
            image_list.forEach((image) => {
                const deleteFilePath = (0, path_1.join)(__dirname, "../../../../", image.path);
                (0, fs_1.unlink)(deleteFilePath, (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    console.log(`File ${deleteFilePath} has been deleted successfully.`);
                });
            });
            await this.ProductImageRepository.delete({
                content: preContent,
            });
            await this.ContentRepository.update({ id: contentId }, updateContentDto);
            const content = await this.ContentRepository.findOneBy({ id: contentId });
            images.forEach((image) => {
                image.content = content;
                console.log("save image: ", image);
                this.ProductImageRepository.save(image);
            });
        }
        catch (error) {
            console.error(error);
        }
    }
    async DeleteOne(contentId) {
        try {
            const content = await this.ContentRepository.createQueryBuilder("contents")
                .where({ id: contentId })
                .getOne();
            const image_list = await this.ProductImageRepository.createQueryBuilder("productimages")
                .where({ content: content })
                .getMany();
            image_list.forEach((image) => {
                const deleteFilePath = (0, path_1.join)(__dirname, "../../../../", image.path);
                (0, fs_1.unlink)(deleteFilePath, (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    console.log(`File ${deleteFilePath} has been deleted successfully.`);
                });
            });
            await this.ProductImageRepository.delete({
                content: content,
            });
            await this.ContentRepository.delete({ id: contentId });
        }
        catch (error) {
            console.error(error);
        }
    }
    async findListAll() {
        try {
            const content_list = await this.ContentRepository.createQueryBuilder("contents")
                .leftJoinAndSelect("contents.seller", "users")
                .leftJoinAndSelect("contents.images", "images")
                .getMany();
            return content_list;
        }
        catch (err) {
            console.error(err);
        }
    }
    async findListImageIsNull() {
        try {
            const content_list = await this.ContentRepository.createQueryBuilder("contents")
                .leftJoinAndSelect("contents.seller", "users")
                .leftJoinAndSelect("contents.images", "images")
                .where("images.id IS NULL")
                .getMany();
            return content_list;
        }
        catch (err) {
            console.error(err);
        }
    }
    async insertFakerData(fakerdata) {
        const res = await this.ContentRepository.save(fakerdata);
        return res;
    }
    async insertFakerImageData(fakerdata) {
        const res = await this.ProductImageRepository.save(fakerdata);
        return res;
    }
    async getFakerImages(content) {
        const productImages = [];
        const image = new productimage_entity_1.ProductImages();
        const dirContents = (0, fs_1.readdirSync)("./upload/");
        const randomNum = Math.ceil(Math.random() * 100);
        image.path = `upload/${dirContents[randomNum]}`;
        image.content = content;
        try {
            await this.insertFakerImageData(image);
            productImages.push(image);
        }
        catch (err) {
            console.error("insertFakerImageData error", image);
        }
        return productImages;
    }
};
__decorate([
    (0, common_1.HttpCode)(204),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_content_dto_1.UpdateContentDto, Number, Object]),
    __metadata("design:returntype", Promise)
], ContentService.prototype, "Update", null);
__decorate([
    (0, common_1.HttpCode)(204),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ContentService.prototype, "DeleteOne", null);
ContentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(content_entity_1.Contents)),
    __param(1, (0, typeorm_1.InjectRepository)(productimage_entity_1.ProductImages)),
    __param(2, (0, typeorm_1.InjectRepository)(favorite_entity_1.Favorites)),
    __param(4, (0, typeorm_1.InjectEntityManager)()),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        auth_shared_service_1.AuthSharedService,
        typeorm_2.EntityManager])
], ContentService);
exports.ContentService = ContentService;
//# sourceMappingURL=content.service.js.map