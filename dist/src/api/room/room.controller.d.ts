import { ChatService } from "src/events/chat/chat.service";
export declare class RoomController {
    private readonly chatService;
    constructor(chatService: ChatService);
    getList(userId: number): Promise<import("../../events/chat/entities/room.entity").Rooms[]>;
    getRoom(roomId: number): Promise<import("../../events/chat/entities/room.entity").Rooms>;
}
