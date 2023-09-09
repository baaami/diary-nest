import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateRoomDto } from "src/events/chat/dto/create-room.dto";
import { Rooms } from "src/events/chat/entities/room.entity";
import { Repository } from "typeorm";

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Rooms) private RoomRepository: Repository<Rooms>
  ) {}

  async createRoom(room: CreateRoomDto): Promise<Rooms> {
    room.buyer_out = false;

    room.seller_out = false;

    room.buyer_confirm_time = new Date();
    room.seller_confirm_time = new Date();

    return await this.RoomRepository.save(room);
  }

  async findExistRoom(room: CreateRoomDto): Promise<Rooms> {
    return await this.RoomRepository.findOneBy({
      content_id: room.content_id,
      buyer_id: room.buyer_id,
    });
  }
}
