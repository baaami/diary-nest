import { Favorites } from "src/common/entities/favorite.entity";
import { Repository } from "typeorm";
import { UserService } from "../user/user.service";
import { ContentService } from "../content/content.service";
import { AuthSharedService } from "../auth/auth.shared.service";
export declare class FavoriteService {
    private readonly userService;
    private readonly contentService;
    private FavoriteRepository;
    private readonly authSharedService;
    constructor(userService: UserService, contentService: ContentService, FavoriteRepository: Repository<Favorites>, authSharedService: AuthSharedService);
    getFavoriteList(userId: number, page: number): Promise<[Favorites[], number]>;
    addFavorite(contentId: number): Promise<{
        like_cnt: number;
    }>;
    delFavorite(contentId: number): Promise<import("typeorm").DeleteResult>;
    insertFakerData(fakerdata: Favorites): Promise<Favorites>;
}
