import { IsString, IsNumber, IsOptional, IsObject } from "class-validator";
import { Users } from "src/api/user/entities/user.entity";

export class CreateProfileImageDto {
  @IsString()
  path: string;

  @IsOptional()
  @IsObject()
  users: Users[];
}
