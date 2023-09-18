import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Reviews } from "src/api/review/entities/review.entity";
import { Repository } from "typeorm";
import { Users } from "../user/entities/user.entity";
import { CreateReviewDto } from "./dto/create-review.dto";
import { AuthSharedService } from "../auth/auth.shared.service";
import { ChatGateway } from "src/events/chat/chats.gateway";

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Reviews) private ReviewRepository: Repository<Reviews>,
    @InjectRepository(Users) private UserRepository: Repository<Users>,
    private readonly authSharedService: AuthSharedService,
    private readonly chatGateway: ChatGateway
  ) {}

  async insertFakerData(fakerdata: Reviews): Promise<Reviews> {
    const res = await this.ReviewRepository.save(fakerdata);

    this.chatGateway.sendReviewNotification(
      fakerdata.seller,
      fakerdata.buyer,
      fakerdata.review
    );

    return res;
  }

  // 특정 회원 리뷰 조회
  async getlist(sellerId: number): Promise<Reviews[]> {
    const reviews = await this.ReviewRepository.createQueryBuilder("reviews")
      .where("reviews.seller_id = :sellerId", { sellerId })
      .leftJoinAndSelect("reviews.buyer", "buyer")
      .leftJoinAndSelect("buyer.profileImage", "buyerImages")
      .leftJoinAndSelect("reviews.seller", "seller")
      .leftJoinAndSelect("seller.profileImage", "sellerImages")
      .getMany();

    return reviews;
  }

  async create(
    createReviewDto: CreateReviewDto,
    sellerId: number
  ): Promise<Reviews> {
    const buyer: Users = this.authSharedService.getUser();
    const seller: Users = await this.UserRepository.createQueryBuilder("users")
      .where({ id: sellerId })
      .getOne();

    const review = new Reviews();

    review.grade = createReviewDto.grade;
    (review.review = createReviewDto.review),
      (review.seller = seller),
      (review.buyer = buyer);

    this.chatGateway.sendReviewNotification(seller, buyer, review.review);

    try {
      const res = await this.ReviewRepository.save(review);

      // User의 Grade 업데이트

      const userReviews = await this.ReviewRepository.createQueryBuilder(
        "reviews"
      )
        .leftJoinAndSelect("reviews.seller", "seller")
        .where("seller.id = :sellerId", { sellerId })
        .select(["reviews.id", "reviews.grade"])
        .getMany();

      // 사용자의 리뷰 목록에서 등급(grade)을 추출합니다.
      const grades = userReviews.map((review) => review.grade);

      // 등급(grade)의 평균을 계산합니다.
      const averageGrade =
        grades.reduce((sum, grade) => sum + grade, 0) / (grades.length || 1);

      // 사용자의 등급(grade)을 업데이트합니다.
      await this.UserRepository.createQueryBuilder()
        .update(Users)
        .set({ grade: averageGrade })
        .where("id = :sellerId", { sellerId })
        .execute();

      return res;
    } catch (error) {
      console.error(error);
    }
  }
}
