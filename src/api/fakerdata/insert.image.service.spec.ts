import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../user/user.service"
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "../user/entities/user.entity";
import * as ormconfig from "../../../ormconfig";
import * as faker from "faker";
import { Reviews } from "src/common/entities/review.entity";
import { FavoriteService } from "../favorite/favorite.service";
import { Images } from "src/common/entities/image.entity";
import { Contents } from "../content/entities/content.entity";
import { ContentService } from "../content/content.service";
import * as fs from 'fs';
import { Favorites } from "src/common/entities/favorite.entity";

describe("Insert Review", () => {
  let service: ContentService
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([Images, Contents, Users, Favorites, Reviews]),
        TypeOrmModule.forRoot(ormconfig),
      ],
      providers: [ContentService],
    }).compile();
    service = module.get<ContentService>(ContentService);
  });

  it("should be content service defined", () => {
    expect(service).toBeDefined();
  });

  describe("Insert Faker Images", () => {
      it('should download 20 images', async () => {
        const contents = await service.findList()

        const image = new Images();
        image.filename = faker.system.fileName();
        image.path = faker.system.filePath();
        image.fieldname = faker.system.commonFileName();
        image.originalname = faker.system.commonFileName();
        image.encoding = '7bit';
        image.mimetype = faker.system.mimeType();
        image.destination = faker.system.directoryPath();
        image.size = faker.datatype.number();
    
        // 랜덤한 contents에 이미지 삽입
        const randomIndex = Math.floor(Math.random() * contents.length);
        image.content = contents[randomIndex];
    })
  }) 
})