import { IsNumber, IsDate, IsBoolean } from "class-validator";
import { IsNull } from "typeorm";

export class CreateRoomDto {
  @IsNumber()
  readonly content_id: number;

  @IsNumber()
  readonly seller_id: number;

  @IsNumber()
  readonly buyer_id: number;

  @IsBoolean()
  seller_out: boolean = false;

  @IsBoolean()
  buyer_out: boolean = false;

  @IsDate()
  seller_confirm_time: Date = new Date();

  @IsDate()
  buyer_confirm_time: Date = new Date();
}
