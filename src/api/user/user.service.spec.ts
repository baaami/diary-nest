import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "./entities/user.entity";
import { Contents } from "../content/entities/content.entity";
import { Images } from "src/common/entities/productimage.entity";

import { UserController } from "./user.controller";
import * as ormconfig from "../../../ormconfig";
import { AuthService } from "../auth/auth.service";
import { JwtService } from "@nestjs/jwt";
import { Repository, UpdateResult } from "typeorm";
import { UpdateUserDto } from "./dto/update-user.dto";

describe("AuthService", () => {
  let service: UserService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([Users, Contents, Images]),
        TypeOrmModule.forRoot(ormconfig),
      ],
      providers: [UserService, AuthService, JwtService],
    }).compile();
    service = module.get<UserService>(UserService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("Upload User form", () => {
    it("upload user", async () => {
      // given : 테스트를 하기 위한 환경 구성
      const user: Users = await service.findlatest();
      expect(user).toBeDefined();

      const userUpdateInfo: UpdateUserDto = {
        name: "yoni",
        nickname: "yonyoni",
        age: 28,
        gender: 0,
        school: "백석대학교",
        major: "청소년학과",
        studentId: 201501149,
      };

      // when : 테스트 함수 실행
      await service.update(userUpdateInfo, user);

      // then : 테스트 함수 결과
      const resultUser: Users = await service.findOne(user.id);
      expect(resultUser.major).toEqual(userUpdateInfo.major);
      expect(resultUser.nickname).toEqual(userUpdateInfo.nickname);
      expect(resultUser.age).toEqual(userUpdateInfo.age);
      expect(resultUser.gender).toEqual(userUpdateInfo.gender);
      expect(resultUser.school).toEqual(userUpdateInfo.school);
      expect(resultUser.major).toEqual(userUpdateInfo.major);
      expect(resultUser.studentId).toEqual(userUpdateInfo.studentId);
    });
  });
});
