import { CreateUserDto } from "./create-user.dto";
import { ProfileImages } from "src/common/entities/profileimage.entity";
declare const UpdateUserDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateUserDto>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
    readonly name: string;
    readonly birth: Date;
    readonly nickname: string;
    readonly email: string;
    readonly password: string;
    readonly university: string;
    readonly grade: number;
    readonly gender: number;
    readonly latitude: number;
    readonly longitude: number;
    readonly location: string;
    profileImage: ProfileImages;
}
export {};
