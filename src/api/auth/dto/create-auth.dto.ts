import { IsString, IsNumber, IsOptional } from "class-validator";

export class CreateAuthKakaoDto {
  @IsString()
  readonly code: string;
}

export class CreateAuthLocalDto {
  @IsString()
  readonly code: string;
}
