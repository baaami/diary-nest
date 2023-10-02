import { ProfileImages } from "src/common/entities/profileimage.entity";
export declare class CreateAuthKakaoDto {
    readonly code: string;
}
export declare class CreateAuthLocalDto {
    readonly name: string;
    readonly birth: Date;
    readonly nickname: string;
    readonly email: string;
    readonly password: string;
    readonly university: string;
    readonly gender: number;
    readonly latitude: number;
    readonly longitude: number;
    readonly location: string;
    profileImage: ProfileImages;
}
export declare class CreateSignInLocalDto {
    readonly email: string;
    readonly password: string;
}
