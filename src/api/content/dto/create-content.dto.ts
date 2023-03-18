import { IsString, IsNumber, IsOptional, IsObject } from "class-validator";
import { Users } from "src/api/user/entities/user.entity";

export class CreateContentDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly body: string;

  @IsOptional()
  @IsObject()
  owner: Users;
}
