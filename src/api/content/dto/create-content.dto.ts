import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateContentDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly content: string;

  @IsOptional()
  @IsNumber()
  readonly userId: number;
}
