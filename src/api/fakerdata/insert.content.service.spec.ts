import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../user/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "../user/entities/user.entity";
import * as ormconfig from "../../../ormconfig";
import * as faker from "faker";
import { Contents } from "../content/entities/content.entity";
import { ContentService } from "../content/content.service";
import { Images } from "src/common/entities/image.entity";
import { Favorites } from "src/common/entities/favorite.entity";
import { Reviews } from "src/api/review/entities/review.entity";
import { time } from "console";
import { content_cnt } from "./insert.common.types";
import { randomIntFromInterval } from "src/common/util";

// jest.setTimeout(30000);

const categories = [
  "electronic",
  "clothes",
  "lecture",
  "furniture",
  "book",
  "householdGoods",
  "sports",
  "hobby",
  "beauty",
];

describe("Insert User", () => {
  let service: ContentService;
  let user_service: UserService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([Users, Contents, Images, Favorites, Reviews]),
        TypeOrmModule.forRoot(ormconfig),
      ],
      providers: [ContentService, UserService],
    }).compile();
    service = module.get<ContentService>(ContentService);
    user_service = module.get<UserService>(UserService);
  });

  it("should be defined Content Service", () => {
    expect(service).toBeDefined();
  });

  it("should be defined User Service", () => {
    expect(user_service).toBeDefined();
  });

  describe("Insert Faker Content", () => {
    for (let i = 0; i < content_cnt; i++) {
      it("create a Content " + i.toString(), async () => {
        // given : 테스트를 하기 위한 환경 구성

        // 데이터 생성
        const content = new Contents();
        content.title = faker.commerce.productName();
        content.body = faker.lorem.sentences(3, { words: 50 });
        content.category = categories[randomIntFromInterval(0, 10)];
        content.completed = faker.datatype.boolean();
        content.price = faker.datatype.number({ min: 1000, max: 100000 });
        content.latitude = parseFloat(faker.address.latitude(36, 38));
        content.longitude = parseFloat(faker.address.longitude(127, 128));
        content.location = faker.address.streetAddress();
        content.like_cnt = faker.datatype.number({ min: 0, max: 100 });
        content.chat_cnt = faker.datatype.number({ min: 0, max: 10 });
        content.completed_date = faker.date.future();

        const seller = await user_service.findRandomOne();
        content.seller = seller;

        if (content.completed) {
          const user = await user_service.findExcludeRandomOne(seller.id);
          content.buyer = user;
        }

        // 2. 글 생성
        const savedContent: Contents = await service.insertFakerData(content);

        // then : 테스트 함수 결과
        expect(savedContent.id).toBeDefined();
        expect(savedContent.title).toEqual(content.title);
        expect(savedContent.body).toEqual(content.body);
        expect(savedContent.category).toEqual(content.category);
        expect(savedContent.completed).toEqual(content.completed);
        expect(savedContent.price).toEqual(content.price);
        expect(savedContent.like_cnt).toEqual(content.like_cnt);
        expect(savedContent.chat_cnt).toEqual(content.chat_cnt);
        expect(savedContent.completed_date).toEqual(content.completed_date);
        expect(savedContent.buyer).toEqual(content.buyer);
        expect(savedContent.seller).toEqual(content.seller);
      });
    }
  });
});
