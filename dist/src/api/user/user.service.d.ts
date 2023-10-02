/// <reference types="multer" />
import { Repository } from "typeorm";
import { Users } from "src/api/user/entities/user.entity";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ProfileImages } from "src/common/entities/profileimage.entity";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { AuthSharedService } from "../auth/auth.shared.service";
import { UpdateLocationDto } from "./dto/update-location.dto";
export declare class UserService {
    private UserRepository;
    private ProfileImageRepository;
    private readonly authSharedService;
    constructor(UserRepository: Repository<Users>, ProfileImageRepository: Repository<ProfileImages>, authSharedService: AuthSharedService);
    findOne(userId: number): Promise<Users>;
    findNickName(userId: number): Promise<string>;
    findlatest(): Promise<Users>;
    findRandomOne(): Promise<Users>;
    findExcludeRandomOne(user_exclude_Id: number): Promise<Users>;
    insertFakerData(testuser: Users): Promise<Users>;
    islogin(): Promise<Users>;
    update(updateUserDto: UpdateUserDto): Promise<void>;
    updateLocation(updateLocationDto: UpdateLocationDto): Promise<Users>;
    updateProfile(updateProfileDto: UpdateProfileDto, files: {
        profileImage?: Express.Multer.File[];
    }): Promise<Users>;
    getDefaultImage(): Promise<ProfileImages>;
}
