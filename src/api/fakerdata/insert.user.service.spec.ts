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
  const faker_user_cnt = 20;
  let service: UserService
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([Users, Contents, Images, Favorites, Reviews]),
        TypeOrmModule.forRoot(ormconfig),
      ],
      providers: [UserService],
    }).compile();
    service = module.get<UserService>(UserService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("Insert Faker User", () => {
    for(let i = 0; i < faker_user_cnt; i++) {
      it("create a User " + i.toString(), async () => {
        // given : 테스트를 하기 위한 환경 구성
  
        // 1. image 데이터 생성
        const fakeUser: Users = new Users();
        fakeUser.name = faker.name.firstName();
        fakeUser.birth = faker.date.past();
        fakeUser.nickname = faker.internet.userName();
        fakeUser.email = faker.internet.email();
        fakeUser.is_sns = faker.random.boolean();
        fakeUser.university = faker.company.companyName();
        fakeUser.gender = faker.random.number(1);
        fakeUser.latitude = faker.address.latitude();
        fakeUser.longitude = faker.address.longitude();
        fakeUser.location = faker.address.city();
        fakeUser.grade = faker.random.number(4);
  
        // 2. 글 생성
        const user: Users = await service.insertFakerData(fakeUser);
  
        // then : 테스트 함수 결과
        expect(user).toBeDefined();
        expect(user.name).toEqual(fakeUser.name);
        expect(user.birth).toEqual(fakeUser.birth);
        expect(user.nickname).toEqual(fakeUser.nickname);
        expect(user.email).toEqual(fakeUser.email);
        expect(user.is_sns).toEqual(fakeUser.is_sns);
        expect(user.university).toEqual(fakeUser.university);
        expect(user.gender).toEqual(fakeUser.gender);
        expect(user.latitude).toEqual(fakeUser.latitude);
        expect(user.longitude).toEqual(fakeUser.longitude);
        expect(user.location).toEqual(fakeUser.location);
        expect(user.grade).toEqual(fakeUser.grade);
      });
    }
  }) 
})