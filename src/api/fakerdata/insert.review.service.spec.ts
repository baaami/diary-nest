import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../user/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "../user/entities/user.entity";
import * as ormconfig from "../../../ormconfig";
import * as faker from "faker";
import { Reviews } from "../review/entities/review.entity";
import { ReviewService } from "../review/review.service";
import { ProductImages } from "src/common/entities/productimage.entity";
import { Contents } from "../content/entities/content.entity";
import { Favorites } from "src/common/entities/favorite.entity";
import { review_cnt } from "./insert.common.types";
import { AuthSharedService } from "../auth/auth.shared.service";
import { ProfileImages } from "src/common/entities/profileimage.entity";

describe("Insert Review", () => {
  let service: ReviewService;
  let user_service: UserService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([
          Reviews,
          Users,
          ProductImages,
          Contents,
          Favorites,
          ProfileImages,
        ]),
        TypeOrmModule.forRoot(ormconfig),
      ],
      providers: [ReviewService, UserService, AuthSharedService],
    }).compile();
    service = module.get<ReviewService>(ReviewService);
    user_service = module.get<UserService>(UserService);
  });

  it("should be review service defined", () => {
    expect(service).toBeDefined();
  });

  it("should be review user service defined", () => {
    expect(user_service).toBeDefined();
  });

  describe("Insert Faker Review", () => {
    for (let i = 0; i < review_cnt; i++) {
      it("create a Review " + i.toString(), async () => {
        // given : 테스트를 하기 위한 환경 구성

        // 1. faker 데이터 생성
        const review = new Reviews();

        const buyer = await user_service.findRandomOne();
        review.buyer = buyer;

        const seller = await user_service.findExcludeRandomOne(buyer.id);
        review.seller = seller;

        review.review = faker.lorem.sentences(4, { words: 20 });
        review.grade = faker.datatype.number({ min: 0, max: 5 });

        // 2. DB 저장
        const savedReview: Reviews = await service.insertFakerData(review);

        // then : 테스트 함수 결과
        expect(review.buyer).toEqual(savedReview.buyer);
        expect(review.seller).toEqual(savedReview.seller);
        expect(review.review).toEqual(savedReview.review);
        expect(review.grade).toEqual(savedReview.grade);
      });
    }
  });
});
