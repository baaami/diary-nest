import { Transform, Type } from "class-transformer";
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
}

export class CreateSignInLocalDto {
  @IsString()
  readonly email: string;

  @IsString()
  readonly password: string;
}
