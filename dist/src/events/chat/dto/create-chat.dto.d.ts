import { Rooms } from "../entities/room.entity";
export declare class CreateChatDto {
    readonly send_id: number;
    readonly message: string;
    readonly room: Rooms;
}
