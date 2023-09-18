import {
  IsString,
  IsNumber,
  IsDate,
  IsBoolean,
  IsOptional,
} from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { Type, Transform } from "class-transformer";
import { ProfileImages } from "src/common/entities/profileimage.entity";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  readonly name: string;

  @Type(() => Date)
  readonly birth: Date;

  @IsString()
  readonly nickname: string;

  @IsString()
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly password: string;

  @IsString()
  readonly university: string;

  @IsOptional()
  @IsNumber()
  readonly grade: number = 0;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  readonly gender: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  readonly latitude: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  readonly longitude: number;

  @IsString()
  readonly location: string;

  @IsOptional()
  profileImage: ProfileImages;
}
