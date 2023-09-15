import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";
import { Users } from "src/api/user/entities/user.entity";

export class CreateNotification {
  @IsNumber()
  type: number;

  @IsString()
  msg: string;

  @IsOptional()
  @IsBoolean()
  confirmed: boolean = false;

  // 알림 발생자(?)
  @IsObject()
  notifier: Users;

  // 수신자
  @IsObject()
  receiver: Users;
}
