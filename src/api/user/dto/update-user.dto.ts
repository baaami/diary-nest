import { IsString, IsNumber, IsDate, IsBoolean, IsOptional } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { Type } from "class-transformer";

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

  @IsNumber()
  readonly gender: number;

  @IsString()
  readonly latitude: string;

  @IsString()
  readonly longitude: string;

  @IsString()
  readonly location: string;

  @IsNumber()
  readonly grade: number;
}
