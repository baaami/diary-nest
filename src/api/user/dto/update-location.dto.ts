import {
    IsString,
    IsNumber,
  } from "class-validator";
  import { PartialType } from "@nestjs/mapped-types";
  import { CreateUserDto } from "./create-user.dto";
  import { Type, Transform } from "class-transformer";
  
  export class UpdateLocationDto extends PartialType(CreateUserDto) {
    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    readonly latitude: number;
  
    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    readonly longitude: number;
  
    @IsString()
    readonly location: string;
  }
  