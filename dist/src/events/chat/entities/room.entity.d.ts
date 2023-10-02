import { Chats } from "./chat.entity";
export declare class Rooms {
    id: number;
    content_id: number;
    seller_id: number;
    buyer_id: number;
    seller_out: boolean;
    buyer_out: boolean;
    seller_confirm_time: Date;
    buyer_confirm_time: Date;
    chats: Chats[];
}
