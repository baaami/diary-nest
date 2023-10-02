"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const update_user_dto_1 = require("./dto/update-user.dto");
const profileimage_entity_1 = require("../../common/entities/profileimage.entity");
const update_profile_dto_1 = require("./dto/update-profile.dto");
const path_1 = require("path");
const fs_1 = require("fs");
const auth_shared_service_1 = require("../auth/auth.shared.service");
const update_location_dto_1 = require("./dto/update-location.dto");
let UserService = class UserService {
    constructor(UserRepository, ProfileImageRepository, authSharedService) {
        this.UserRepository = UserRepository;
        this.ProfileImageRepository = ProfileImageRepository;
        this.authSharedService = authSharedService;
    }
    async findOne(userId) {
        const user = await this.UserRepository.createQueryBuilder("users")
            .leftJoinAndSelect("users.contents", "contents")
            .leftJoinAndSelect("users.profileImage", "profileImage")
            .where({ id: userId })
            .getOne();
        return user;
    }
    async findNickName(userId) {
        const user = await this.UserRepository.createQueryBuilder("users")
            .where({ id: userId })
            .getOne();
        return user.nickname;
    }
    async findlatest() {
        const rep = await this.UserRepository.find();
        return rep[0];
    }
    async findRandomOne() {
        const users = await this.UserRepository.find({});
        const randomIndex = Math.floor(Math.random() * users.length);
        return users[randomIndex];
    }
    async findExcludeRandomOne(user_exclude_Id) {
        const users = await this.UserRepository.find({
            where: {
                id: (0, typeorm_2.Not)(user_exclude_Id),
            },
        });
        const randomIndex = Math.floor(Math.random() * users.length);
        return users[randomIndex];
    }
    async insertFakerData(testuser) {
        const res = await this.UserRepository.save(testuser);
        return res;
    }
    async islogin() {
        const user = this.authSharedService.getUser();
        const res = await this.UserRepository.createQueryBuilder("users")
            .leftJoinAndSelect("users.contents", "contents")
            .leftJoinAndSelect("users.profileImage", "profileImage")
            .where({ id: user.id })
            .getOne();
        return res;
    }
    async update(updateUserDto) {
        const user = this.authSharedService.getUser();
        try {
            await this.UserRepository.update({ id: user.id }, updateUserDto);
        }
        catch (err) {
            console.error(err);
        }
        try {
            await this.UserRepository.createQueryBuilder("users")
                .leftJoinAndSelect("users.contents", "contents")
                .leftJoinAndSelect("users.profileImage", "profileImage")
                .where({ id: user.id })
                .getOne();
        }
        catch (err) {
            console.error(err);
        }
    }
    async updateLocation(updateLocationDto) {
        try {
            const { latitude, longitude, location } = updateLocationDto;
            const user = await this.authSharedService.getUser();
            user.latitude = latitude;
            user.longitude = longitude;
            user.location = location;
            const updatedUser = await this.UserRepository.save(user);
            return updatedUser;
        }
        catch (err) {
            console.error(err);
        }
    }
    async updateProfile(updateProfileDto, files) {
        const loginedUser = this.authSharedService.getUser();
        console.log("files: ", files);
        const { profileImage } = files;
        if (profileImage) {
            const preUser = await this.UserRepository.createQueryBuilder("users")
                .where({ id: loginedUser.id })
                .leftJoinAndSelect("users.profileImage", "profileImage")
                .getOne();
            if (preUser.profileImage &&
                preUser.profileImage.path != "upload/default.svg") {
                const image = await this.ProfileImageRepository.createQueryBuilder("profileimages")
                    .where({ path: preUser.profileImage.path })
                    .getOne();
                if (image) {
                    const deleteFilePath = (0, path_1.join)(__dirname, "../../../../", image.path);
                    (0, fs_1.unlink)(deleteFilePath, (err) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        console.log(`File ${deleteFilePath} has been deleted successfully.`);
                    });
                    const delete_path = preUser.profileImage.path;
                    preUser.profileImage = null;
                    await this.UserRepository.save(preUser);
                    await this.ProfileImageRepository.delete({
                        path: delete_path,
                    });
                }
            }
            let imageDto = {
                path: profileImage[0].path,
                users: [],
            };
            imageDto.users.push(loginedUser);
            const newProfileImage = await this.ProfileImageRepository.save(imageDto);
            updateProfileDto.profileImage = newProfileImage;
        }
        else {
            console.log("image not found");
        }
        await this.UserRepository.update({ id: loginedUser.id }, updateProfileDto);
        const user = await this.UserRepository.createQueryBuilder("users")
            .leftJoinAndSelect("users.contents", "contents")
            .leftJoinAndSelect("users.profileImage", "profileImage")
            .where({ id: loginedUser.id })
            .getOne();
        return user;
    }
    async getDefaultImage() {
        const defaultImage = await this.ProfileImageRepository.findOneBy({
            path: "upload/default.svg",
        });
        if (defaultImage) {
            return defaultImage;
        }
        else {
            const saveDefaultImage = await this.ProfileImageRepository.save({
                path: "upload/default.svg",
            });
            return saveDefaultImage;
        }
    }
};
__decorate([
    (0, common_1.HttpCode)(204),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "update", null);
__decorate([
    (0, common_1.HttpCode)(204),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_location_dto_1.UpdateLocationDto]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "updateLocation", null);
__decorate([
    (0, common_1.HttpCode)(204),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_profile_dto_1.UpdateProfileDto, Object]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "updateProfile", null);
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.Users)),
    __param(1, (0, typeorm_1.InjectRepository)(profileimage_entity_1.ProfileImages)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        auth_shared_service_1.AuthSharedService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map