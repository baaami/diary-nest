import { Repository } from "typeorm";
import { Chats } from "./entities/chat.entity";
import { Rooms } from "./entities/room.entity";
import { CreateRoomDto } from "./dto/create-room.dto";
import { CreateChatDto } from "./dto/create-chat.dto";
import { RoomService } from "src/api/room/rooms.service";
export declare class ChatService {
    private RoomRepository;
    private ChatRepository;
    private readonly roomService;
    constructor(RoomRepository: Repository<Rooms>, ChatRepository: Repository<Chats>, roomService: RoomService);
    getRoomId(room: CreateRoomDto): Promise<string>;
    getRoomById(id: number): Promise<Rooms>;
    getJoinedRoomList(userId: number): Promise<Rooms[]>;
    getRoomInfo(roomId: number): Promise<Rooms>;
    getChatList(page: number, roomId: Number): Promise<[Chats[], number]>;
    getChatLatest(roomId: Number): Promise<Chats>;
    getChatPartner(userId: string, room: Rooms): number;
    addMessage(msgPayload: CreateChatDto): Promise<void>;
    updateConfirmTime(roomId: number, memberType: number): Promise<void>;
    getUserType(room: Rooms, userId: number): number;
    confirmChat(userId: number, room: Rooms): Promise<void>;
    IsLeaveAll(roomId: number): Promise<boolean>;
    leaveRoom(userId: number, roomId: number): Promise<void>;
    deleteRoom(room: Rooms): Promise<void>;
}
