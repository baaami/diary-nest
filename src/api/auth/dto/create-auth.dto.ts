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

export class CreateSignInLocalDto {
  @IsString()
  readonly id: string;

  @IsString()
  readonly pwd: string;
}