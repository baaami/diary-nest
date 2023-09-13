import { IsNumber, IsObject, IsString } from "class-validator";
import { Rooms } from "../entities/room.entity";

export class CreateChatDto {
  @IsNumber()
  readonly send_id: number;

  @IsString()
  readonly message: string;

  @IsObject()
  readonly room: Rooms;
}
