import { IsString, IsNumber, IsDate, IsBoolean } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  readonly name: string;

  @IsDate()
  readonly birth: Date;

  @IsString()
  readonly nickname: string;
  @IsString()
  readonly email: string;
  @IsBoolean()
  readonly is_sns: boolean;
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
