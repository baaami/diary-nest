import { IsString, IsNumber, IsOptional, IsObject } from "class-validator";
import { Contents } from "src/api/content/entities/content.entity";
import { Users } from "src/api/user/entities/user.entity";

export class CreateImageDto {
  @IsString()
  readonly fieldname: string;

  @IsString()
  readonly originalname: string;

  @IsString()
  readonly encoding: string;

  @IsString()
  readonly mimetype: string;

  @IsString()
  readonly destination: string;

  @IsOptional()
  @IsString()
  readonly filename: string;

  @IsString()
  readonly path: string;

  @IsOptional()
  @IsObject()
  content: Contents;

  @IsOptional()
  @IsObject()
  user: Users;

  @IsNumber()
  readonly size: number;
}
