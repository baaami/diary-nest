import { Contents } from "src/api/content/entities/content.entity";
import { Reviews } from "src/api/review/entities/review.entity";
import { Favorites } from "src/common/entities/favorite.entity";
import { ProfileImages } from "src/common/entities/profileimage.entity";
export declare class Users {
    id: number;
    name: string;
    birth: Date;
    nickname: string;
    email: string;
    password: string;
    university: string;
    gender: number;
    latitude: number;
    longitude: number;
    location: string;
    grade: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    reviews: Reviews[];
    favorites: Favorites[];
    contents: Contents;
    profileImage: ProfileImages;
}
