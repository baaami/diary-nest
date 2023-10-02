import { CreateUserDto } from "./create-user.dto";
import { ProfileImages } from "src/common/entities/profileimage.entity";
declare const UpdateProfileDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateUserDto>>;
export declare class UpdateProfileDto extends UpdateProfileDto_base {
    readonly nickname: string;
    readonly password: string;
    profileImage: ProfileImages;
}
export {};
