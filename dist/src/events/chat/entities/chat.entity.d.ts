import { Rooms } from "./room.entity";
export declare class Chats {
    id: number;
    send_id: number;
    message: string;
    createdAt: Date;
    room: Rooms;
}
