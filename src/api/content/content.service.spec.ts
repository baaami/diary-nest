import { Test, TestingModule } from "@nestjs/testing";
import { Users } from "../user/entities/user.entity";
import { Contents } from "../content/entities/content.entity";
import { Images } from "src/common/entities/productimage.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContentService } from "./content.service";
import { UserService } from "src/api/user/user.service";
import * as ormconfig from "../../../ormconfig";
import { CreateContentDto } from "./dto/create-content.dto";
import { UpdateResult } from "typeorm";
import { UpdateContentDto } from "./dto/update-content.dto";

describe("ContentService", () => {
  let service: ContentService;
  let userService: UserService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([Users, Contents, Images]),
        TypeOrmModule.forRoot(ormconfig),
      ],
      providers: [ContentService, UserService],
    }).compile();
    service = module.get<ContentService>(ContentService);
    userService = module.get<UserService>(UserService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("Create Content", () => {
    it("create a content", async () => {
      // given : 테스트를 하기 위한 환경 구성

      // 1. image 데이터 생성
      // 2. 글 생성
      const user: Users = await userService.findlatest();
      const files: { images?: Express.Multer.File[] } = {
        images: null,
      };

      const createContentDto: CreateContentDto = {
        title: "jest title",
        content: "jest content",
        userId: user.id,
      };

      // when : 테스트 함수 실행
      const content: Contents = await service.Create(
        createContentDto,
        files,
        user
      );

      // then : 테스트 함수 결과
      expect(content.title).toEqual(createContentDto.title);
      expect(content.body).toEqual(createContentDto.content);
    });
  });

  describe("Update Content", () => {
    it("update a content", async () => {
      // given : 테스트를 하기 위한 환경 구성

      // 1. image 데이터 생성
      // 2. 글 생성
      const user: Users = await userService.findlatest();
      const files: { images?: Express.Multer.File[] } = {
        images: null,
      };

      const updateContentDto: UpdateContentDto = {
        title: "jest update title",
        content: "jest update content",
        userId: user.id,
      };

      // when : 테스트 함수 실행
      const updateContent: UpdateResult = await service.Update(
        updateContentDto,
        user.id,
        files
      );
    });
  });

  describe("get Content", () => {
    it("should return a content", async () => {
      const result = await service.findOne(6);
      expect(result).toBeInstanceOf(Contents);
    });
  });

  describe("get Content List", () => {
    it("should return a contents", async () => {
      const result = await service.findList();
      expect(result).toBeInstanceOf(Array);
    });
  });
});
