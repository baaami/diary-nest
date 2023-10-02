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
exports.ReviewService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const review_entity_1 = require("./entities/review.entity");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const auth_shared_service_1 = require("../auth/auth.shared.service");
const chats_gateway_1 = require("../../events/chat/chats.gateway");
let ReviewService = class ReviewService {
    constructor(ReviewRepository, UserRepository, authSharedService, chatGateway) {
        this.ReviewRepository = ReviewRepository;
        this.UserRepository = UserRepository;
        this.authSharedService = authSharedService;
        this.chatGateway = chatGateway;
    }
    async insertFakerData(fakerdata) {
        const res = await this.ReviewRepository.save(fakerdata);
        this.chatGateway.sendReviewNotification(fakerdata.seller, fakerdata.buyer, fakerdata.review);
        return res;
    }
    async getlist(sellerId) {
        const reviews = await this.ReviewRepository.createQueryBuilder("reviews")
            .where("reviews.seller_id = :sellerId", { sellerId })
            .leftJoinAndSelect("reviews.buyer", "buyer")
            .leftJoinAndSelect("buyer.profileImage", "buyerImages")
            .leftJoinAndSelect("reviews.seller", "seller")
            .leftJoinAndSelect("seller.profileImage", "sellerImages")
            .getMany();
        return reviews;
    }
    async create(createReviewDto, sellerId) {
        const buyer = this.authSharedService.getUser();
        const seller = await this.UserRepository.createQueryBuilder("users")
            .where({ id: sellerId })
            .getOne();
        const review = new review_entity_1.Reviews();
        review.grade = createReviewDto.grade;
        (review.review = createReviewDto.review),
            (review.seller = seller),
            (review.buyer = buyer);
        this.chatGateway.sendReviewNotification(seller, buyer, review.review);
        try {
            const res = await this.ReviewRepository.save(review);
            const userReviews = await this.ReviewRepository.createQueryBuilder("reviews")
                .leftJoinAndSelect("reviews.seller", "seller")
                .where("seller.id = :sellerId", { sellerId })
                .select(["reviews.id", "reviews.grade"])
                .getMany();
            const grades = userReviews.map((review) => review.grade);
            const averageGrade = grades.reduce((sum, grade) => sum + grade, 0) / (grades.length || 1);
            await this.UserRepository.createQueryBuilder()
                .update(user_entity_1.Users)
                .set({ grade: Number(averageGrade.toFixed(1)) })
                .where("id = :sellerId", { sellerId })
                .execute();
            return res;
        }
        catch (error) {
            console.error(error);
        }
    }
};
ReviewService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(review_entity_1.Reviews)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.Users)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        auth_shared_service_1.AuthSharedService,
        chats_gateway_1.ChatGateway])
], ReviewService);
exports.ReviewService = ReviewService;
//# sourceMappingURL=review.service.js.map