import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../user/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "../user/entities/user.entity";
import * as ormconfig from "../../../ormconfig";
import * as faker from "faker";
import { Reviews } from "src/api/review/entities/review.entity";
import { FavoriteService } from "../favorite/favorite.service";
import { Images } from "src/common/entities/image.entity";
import { Contents } from "../content/entities/content.entity";
import { ContentService } from "../content/content.service";
import * as fs from "fs";
import { Favorites } from "src/common/entities/favorite.entity";
import axios, { all, AxiosResponse } from "axios";
import { Console } from "console";
import { image_cnt_per_content } from "./insert.common.types";

jest.setTimeout(30000)

describe("Insert Review", () => {
  let service: ContentService;
  let all_contents: Contents[] = []
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([Images, Contents, Users, Favorites, Reviews]),
        TypeOrmModule.forRoot(ormconfig),
      ],
      providers: [ContentService],
    }).compile();
    service = module.get<ContentService>(ContentService);
    all_contents = await service.findListImageIsNull()
  });

  it("should be content service defined", () => {
    expect(service).toBeDefined();
  });

  describe("Insert Faker Images", () => {
    it("should download 3 images and insert", async () => {
      const promises = all_contents.map(async (content) => {
        if (content.images.length >= 5) {
          return;
        }
  
        const contents = await service.findListAll();
  
        const image_width = 640;
        const image_height = 480;
        const fakerimage: AxiosResponse<any, any> = await axios.get(`http://placeimg.com/${image_width}/${image_height}/tech`, { responseType: "arraybuffer" });
  
        const image = new Images();
  
        image.filename = `test_${Math.random().toString()}.jpg`;
        fs.writeFileSync(`./upload/${image.filename}`, fakerimage.data);
        image.originalname = image.filename;
        image.path = `upload/${image.filename}` ;
        image.fieldname = 'images';
        image.encoding = '7bit';
        image.mimetype = 'image/jpeg';
        image.destination = './upload';
        image.size = image_width * image_height;
        const randomIndex = Math.floor(Math.random() * contents.length);
        image.content = contents[randomIndex];
  
        const savedImage: Images = await service.insertFakerImageData(image);
  
        expect(savedImage.id).toBeDefined();
        expect(savedImage.filename).toEqual(image.filename);
        expect(savedImage.originalname).toEqual(image.originalname);
        expect(savedImage.path).toEqual(image.path);
        expect(savedImage.fieldname).toEqual(image.fieldname);
        expect(savedImage.encoding).toEqual(image.encoding);
        expect(savedImage.mimetype).toEqual(image.mimetype);
        expect(savedImage.destination).toEqual(image.destination);
        expect(savedImage.size).toEqual(image.size);
        expect(savedImage.content).toEqual(image.content);
      });
  
      await Promise.all(promises);
    });
  });
});
