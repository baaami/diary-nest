import { Transform, Type } from "class-transformer";
import { IsString, IsNumber, IsBoolean, IsOptional } from "class-validator";
import { ProfileImages } from "src/common/entities/profileimage.entity";

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

  @IsOptional()
  profileImage: ProfileImages;
}

export class CreateSignInLocalDto {
  @IsString()
  readonly email: string;

  @IsString()
  readonly password: string;
}
