/// <reference types="multer" />
import { ProductImages } from "src/common/entities/productimage.entity";
import { Contents } from "src/api/content/entities/content.entity";
import { Repository, EntityManager } from "typeorm";
import { CreateContentDto } from "./dto/create-content.dto";
import { UpdateContentDto } from "./dto/update-content.dto";
import { AuthSharedService } from "../auth/auth.shared.service";
import { Favorites } from "src/common/entities/favorite.entity";
export declare class ContentService {
    private ContentRepository;
    private ProductImageRepository;
    private FavoriteRepository;
    private readonly authSharedService;
    private ContentManager;
    constructor(ContentRepository: Repository<Contents>, ProductImageRepository: Repository<ProductImages>, FavoriteRepository: Repository<Favorites>, authSharedService: AuthSharedService, ContentManager: EntityManager);
    findOne(contentId: number): Promise<Contents>;
    findRandomOne(): Promise<Contents>;
    updateFavoriteField(content_list_And_cnt: [Contents[], number]): Promise<[Contents[], number]>;
    findList(page: number): Promise<[Contents[], number]>;
    getListByKeyword(keyword: string, page: number): Promise<[Contents[], number]>;
    getProductsByCategory(category: string, page: number): Promise<[Contents[], number]>;
    getSellingProductsByUser(userId: number, page: number): Promise<[Contents[], number]>;
    getSoldProductsByUser(userId: number, page: number): Promise<[Contents[], number]>;
    getBoughtProductList(userId: number, page: number): Promise<[Contents[], number]>;
    complete(contentId: number): Promise<void>;
    writeOne(createContentDto: CreateContentDto): Promise<CreateContentDto & Contents>;
    Create(createContentDto: CreateContentDto, files: {
        images?: Express.Multer.File[];
    }): Promise<Contents>;
    Update(updateContentDto: UpdateContentDto, contentId: number, files: {
        images?: Express.Multer.File[];
    }): Promise<void>;
    DeleteOne(contentId: number): Promise<void>;
    findListAll(): Promise<Contents[]>;
    findListImageIsNull(): Promise<Contents[]>;
    insertFakerData(fakerdata: Contents): Promise<Contents>;
    insertFakerImageData(fakerdata: ProductImages): Promise<ProductImages>;
    getFakerImages(content: Contents): Promise<ProductImages[]>;
}
