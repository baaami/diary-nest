import { IsNumber, IsDate, IsBoolean, IsOptional } from "class-validator";
import { IsNull } from "typeorm";

export class CreateRoomDto {
  @IsNumber()
  readonly content_id: number;

  @IsNumber()
  readonly seller_id: number;

  @IsNumber()
  readonly buyer_id: number;

  @IsOptional()
  @IsBoolean()
  seller_out: boolean = false;

  @IsOptional()
  @IsBoolean()
  buyer_out: boolean = false;

  @IsOptional()
  @IsDate()
  seller_confirm_time: Date = new Date();

  @IsOptional()
  @IsDate()
  buyer_confirm_time: Date = new Date();
}
