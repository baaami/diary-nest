/// <reference types="multer" />
export declare class PhotosController {
    uploadPhotos(files: Express.Multer.File[]): Promise<string[]>;
}
