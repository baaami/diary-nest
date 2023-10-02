export declare class CreateRoomDto {
    readonly content_id: number;
    readonly seller_id: number;
    readonly buyer_id: number;
    seller_out: boolean;
    buyer_out: boolean;
    seller_confirm_time: Date;
    buyer_confirm_time: Date;
}
