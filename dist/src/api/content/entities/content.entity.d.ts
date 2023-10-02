import { Users } from "src/api/user/entities/user.entity";
import { ProductImages } from "src/common/entities/productimage.entity";
import { Favorites } from "src/common/entities/favorite.entity";
export declare class Contents {
    id: number;
    title: string;
    body: string;
    category: string;
    seller_completed: boolean;
    buyer_completed: boolean;
    latitude: number;
    longitude: number;
    location: string;
    price: number;
    like_cnt: number;
    like: boolean;
    chat_cnt: number;
    completed_date: Date;
    buyer: Users;
    university: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    seller: Users;
    favorites: Favorites[];
    images: ProductImages[];
}
