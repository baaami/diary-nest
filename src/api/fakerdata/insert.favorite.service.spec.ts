import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../user/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "../user/entities/user.entity";
import * as ormconfig from "../../../ormconfig";
import * as faker from "faker";
import { Reviews } from "../review/entities/review.entity";
import { FavoriteService } from "../favorite/favorite.service";
import { ProductImages } from "src/common/entities/productimage.entity";
import { Contents } from "../content/entities/content.entity";
import { ContentService } from "../content/content.service";
import { Favorites } from "src/common/entities/favorite.entity";
import { favorite_cnt } from "./insert.common.types";
import { AuthSharedService } from "../auth/auth.shared.service";
import { ProfileImages } from "src/common/entities/profileimage.entity";

describe("Insert Review", () => {
  let service: FavoriteService;
  let user_service: UserService;
  let content_service: ContentService;
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
      providers: [
        FavoriteService,
        UserService,
        ContentService,
        AuthSharedService,
      ],
    }).compile();
    service = module.get<FavoriteService>(FavoriteService);
    user_service = module.get<UserService>(UserService);
    content_service = module.get<ContentService>(ContentService);
  });

  it("should be review service defined", () => {
    expect(service).toBeDefined();
  });

  it("should be user service defined", () => {
    expect(user_service).toBeDefined();
  });

  it("should be content service defined", () => {
    expect(content_service).toBeDefined();
  });

  describe("Insert Faker favorites", () => {
    for (let i = 0; i < favorite_cnt; i++) {
      it("create a favorite " + i.toString(), async () => {
        // given : 테스트를 하기 위한 환경 구성

        // 1. faker 데이터 생성
        const favorite = new Favorites();

        const user = await user_service.findRandomOne();
        favorite.user = user;

        const content = await content_service.findRandomOne();
        favorite.content = content;

        // 2. DB 저장
        const savedFavorite: Favorites = await service.insertFakerData(
          favorite
        );

        // then : 테스트 함수 결과
        expect(favorite.user).toEqual(savedFavorite.user);
        expect(favorite.content).toEqual(savedFavorite.content);
      });
    }
  });
});
