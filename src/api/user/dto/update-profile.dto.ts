import {
  IsString,
  IsNumber,
  IsDate,
  IsBoolean,
  IsOptional,
} from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";

export class UpdateProfileDto extends PartialType(CreateUserDto) {
  @IsString()
  readonly nickname: string;

  @IsOptional()
  @IsString()
  readonly password: string;
}
