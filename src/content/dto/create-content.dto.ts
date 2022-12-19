import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateContentDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly contents: string;

  @IsNumber()
  readonly UserId: number;
}
