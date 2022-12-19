import { IsString, IsNumber } from 'class-validator';

export class CreateImageDto {
  @IsString()
  readonly path: string;
}
