import { FavoriteService } from "./favorite.service";
import { FavoriteList } from "src/common/entities/common.entity";
export declare class FavoriteController {
    private readonly favoriteService;
    constructor(favoriteService: FavoriteService);
    getFavoriteList(userId: number, page?: number): Promise<FavoriteList>;
    addFavorite(contentId: number): Promise<{
        like_cnt: number;
    }>;
    delFavorite(contentId: number): Promise<import("typeorm").DeleteResult>;
}
