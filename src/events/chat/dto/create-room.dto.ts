import { IsNumber } from "class-validator";

export class CreateRoomDto {
  @IsNumber()
  readonly content_id: number;

  @IsNumber()
  readonly seller_id: number;

  @IsNumber()
  readonly buyer_id: number;
}
