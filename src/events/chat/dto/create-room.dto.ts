import { IsNumber, IsDate } from "class-validator";

export class CreateRoomDto {
  @IsNumber()
  readonly content_id: number;

  @IsNumber()
  readonly seller_id: number;

  @IsNumber()
  readonly buyer_id: number;

  @IsDate()
  seller_confirm_time: Date;

  @IsDate()
  buyer_confirm_time: Date;
}
