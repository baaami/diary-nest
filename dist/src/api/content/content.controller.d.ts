/// <reference types="multer" />
import { ContentService } from "./content.service";
import { CreateContentDto } from "./dto/create-content.dto";
import { UpdateContentDto } from "./dto/update-content.dto";
import { ContentList } from "src/common/entities/common.entity";
export declare class ContentController {
    private readonly contentService;
    constructor(contentService: ContentService);
    searchContentByKeyword(keyword: string, page?: number): Promise<ContentList>;
    list(page?: number): Promise<ContentList>;
    sellingList(userId: number, page?: number): Promise<ContentList>;
    soldList(userId: number, page?: number): Promise<ContentList>;
    boughtList(userId: number, page?: number): Promise<ContentList>;
    categoryList(category: string, page?: number): Promise<ContentList>;
    read(contentId: number): Promise<import("./entities/content.entity").Contents>;
    create(createContentDto: CreateContentDto, files: {
        images?: Express.Multer.File[];
    }): Promise<import("./entities/content.entity").Contents>;
    complete(contentId: number): Promise<void>;
    write(createContentDto: CreateContentDto): Promise<CreateContentDto & import("./entities/content.entity").Contents>;
    update(updateContentDto: UpdateContentDto, files: {
        images?: Express.Multer.File[];
    }, contentId: number): Promise<void>;
    delete(contentId: number): Promise<void>;
}
