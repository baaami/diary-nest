import { Users } from "src/api/user/entities/user.entity";
export declare class CreateContentDto {
    readonly title: string;
    readonly body: string;
    category: string;
    latitude: number;
    longitude: number;
    location: string;
    price: number;
    university: string;
    seller_completed: boolean;
    buyer_completed: boolean;
    seller: Users;
}
