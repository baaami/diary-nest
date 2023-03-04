import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../user/user.service"
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "../user/entities/user.entity";
import * as ormconfig from "../../../ormconfig";
import * as faker from "faker";
import { Contents } from "../content/entities/content.entity";
import { ContentService } from "../content/content.service";
import { Images } from "src/common/entities/image.entity";
import { Favorites } from "src/common/entities/favorite.entity";
import { Reviews } from "src/common/entities/review.entity";

describe("Insert User", () => {
  let service: ContentService
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([Users, Contents, Images, Favorites, Reviews]),
        TypeOrmModule.forRoot(ormconfig),
      ],
      providers: [ContentService],
    }).compile();
    service = module.get<ContentService>(ContentService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("Insert Faker User", () => {
    it("create a User", async () => {
      // given : 테스트를 하기 위한 환경 구성

      // 1. image 데이터 생성
      const content = new Contents();
      content.title = faker.lorem.words(3);
      content.body = faker.lorem.sentences(3, { words: 50 });
      content.category = faker.lorem.word();
      content.completed = faker.random.boolean();
      content.price = faker.random.number({ min: 1000, max: 100000 });
      content.like_cnt = faker.random.number({ min: 0, max: 100 });
      content.chat_cnt = faker.random.number({ min: 0, max: 10 });
      content.completed_date = faker.date.future();
      const user = new Users();
      user.id = faker.random.number({ min: 1, max: 1 });
      content.buyer = user;

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
    });
  }) 
})