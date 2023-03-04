import { IsString, IsNumber, IsOptional } from "class-validator";

export class CreateAuthDto {
  @IsString()
  readonly code: string;
}
