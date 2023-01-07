import { IsString, IsNumber } from 'class-validator';

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

  @IsString()
  readonly filename: string;

  @IsString()
  readonly path: string;

  // @IsNumber()
  // readonly contentId: number;

  @IsNumber()
  readonly size: number;
}
