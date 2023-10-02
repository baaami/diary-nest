/// <reference types="multer" />
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserService } from "./user.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getOne(userId: number): Promise<import("./entities/user.entity").Users>;
    getnickname(userId: number): Promise<string>;
    islogin(): Promise<import("./entities/user.entity").Users>;
    update(updateUserDto: UpdateUserDto): Promise<void>;
    updateLocation(updateLocationDto: UpdateLocationDto): Promise<import("./entities/user.entity").Users>;
    updateProfile(updateProfileDto: UpdateProfileDto, files: {
        profileImage?: Express.Multer.File[];
    }): Promise<import("./entities/user.entity").Users>;
}
