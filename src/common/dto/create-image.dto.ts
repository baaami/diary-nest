import { IsString, IsNumber } from 'class-validator';

export class CreateImageDto {
  @IsNumber()
  readonly id: number;

  @IsString()
  readonly path: string;

  @IsNumber()
  readonly contentId: number;

}
