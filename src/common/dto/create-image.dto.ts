import { IsString, IsNumber, IsOptional } from "class-validator";

export class CreateImageDto {
  @IsString()
  readonly fieldname: string;

  @IsString()
  readonly originalname: string;

  @IsString()
  readonly encoding: string;

  @IsString()
  readonly mimetype: string;

  @IsString()
  readonly destination: string;

  @IsOptional()
  @IsString()
  readonly filename: string;

  @IsString()
  readonly path: string;

  @IsOptional()
  @IsNumber()
  contentId: number;

  @IsNumber()
  readonly size: number;
}
