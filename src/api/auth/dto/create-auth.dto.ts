import { Type } from "class-transformer";
import { IsString, IsNumber, IsBoolean } from "class-validator";

export class CreateAuthKakaoDto {
  @IsString()
  readonly code: string;
}

export class CreateAuthLocalDto {
  @IsString()
  readonly name: string;

  @Type(() => Date)
  readonly birth: Date;

  @IsString()
  readonly nickname: string;

  @IsString()
  readonly email: string;

  @IsString()
  readonly password: string;

  @IsString()
  readonly university: string;

  @IsNumber()
  readonly gender: number;

  @IsNumber()
  readonly latitude: number;

  @IsNumber()
  readonly longitude: number;

  @IsString()
  readonly location: string;
}

export class CreateSignInLocalDto {
  @IsString()
  readonly email: string;

  @IsString()
  readonly password: string;
}