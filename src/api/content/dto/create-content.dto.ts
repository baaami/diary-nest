import { IsString, IsNumber, IsOptional } from "class-validator";

export class CreateContentDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly body: string;

  @IsOptional()
  @IsNumber()
  userId: number;
}
