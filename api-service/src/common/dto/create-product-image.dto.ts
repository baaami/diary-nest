import { IsString, IsNumber, IsOptional, IsObject } from "class-validator";
import { Contents } from "src/api/content/entities/content.entity";

export class CreateProductImageDto {
  @IsString()
  readonly path: string;

  @IsOptional()
  @IsObject()
  content: Contents;
}
