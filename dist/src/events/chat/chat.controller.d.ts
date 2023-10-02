import { ChatService } from "./chat.service";
import { ChatList } from "src/common/entities/common.entity";
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    getList(page: number, roomId: number): Promise<ChatList>;
    getLatestOne(roomId: number): Promise<import("./entities/chat.entity").Chats>;
}
