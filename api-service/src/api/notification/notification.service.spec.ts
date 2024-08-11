import { Test, TestingModule } from "@nestjs/testing";
import { NotificationService } from "./notification.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Notificaitions } from "./entity/notification.entity";
import * as ormconfig from "../../../ormconfig";
import { Users } from "../user/entities/user.entity";
import { ProfileImages } from "src/common/entities/profileimage.entity";

describe("NotificationService", () => {
  let notificationService: NotificationService;
  // 각 테스트 전 실행되는 주기 함수
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([Notificaitions, Users, ProfileImages]),
        TypeOrmModule.forRoot(ormconfig),
      ],
      providers: [NotificationService],
    }).compile();

    notificationService = module.get<NotificationService>(NotificationService);
  });

  it("should be defined", () => {
    expect(notificationService).toBeDefined();
  });

  it("Create Notification", () => {});
});
