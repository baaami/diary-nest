import { CreateRoomDto } from "src/events/chat/dto/create-room.dto";
import { Rooms } from "src/events/chat/entities/room.entity";
import { Repository } from "typeorm";
export declare class RoomService {
    private RoomRepository;
    constructor(RoomRepository: Repository<Rooms>);
    createRoom(room: CreateRoomDto): Promise<Rooms>;
    findExistRoomById(roomId: number): Promise<Rooms>;
    findExistRoom(room: CreateRoomDto): Promise<Rooms>;
}
