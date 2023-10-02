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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const profileimage_entity_1 = require("../../common/entities/profileimage.entity");
const typeorm_2 = require("typeorm");
const qs = require("qs");
const crypto = require("crypto");
const axios_1 = require("axios");
const update_user_dto_1 = require("../user/dto/update-user.dto");
const create_auth_dto_1 = require("./dto/create-auth.dto");
const auth_shared_service_1 = require("./auth.shared.service");
async function GetAccessToken(permissionCode) {
    let bRtn = true;
    let kakaoServerData;
    const kakaoServerTotalData = await (0, axios_1.default)({
        method: "POST",
        url: "https://kauth.kakao.com/oauth/token",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data: qs.stringify({
            grant_type: "authorization_code",
            client_id: process.env.KAKAO_ID,
            redirect_uri: process.env.KAKAO_CALLBACK_URL,
            code: permissionCode,
        }),
    });
    if (!kakaoServerTotalData.data)
        bRtn = false;
    else
        kakaoServerData = kakaoServerTotalData.data;
    const access_token = kakaoServerData.access_token;
    return [bRtn, access_token];
}
async function GetUserData(access_token) {
    let bRtn = true;
    let kakaoServerData;
    const kakaoServerTotalData = await (0, axios_1.default)({
        method: "get",
        url: "https://kapi.kakao.com/v2/user/me",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        params: {
            property_keys: ["kakao_account.profile"],
        },
    });
    if (!kakaoServerTotalData.data)
        bRtn = false;
    else
        kakaoServerData = kakaoServerTotalData.data;
    return [bRtn, kakaoServerData.kakao_account.email];
}
let AuthService = class AuthService {
    constructor(jwtService, UserRepository, ProfileImageRepository, authSharedService) {
        this.jwtService = jwtService;
        this.UserRepository = UserRepository;
        this.ProfileImageRepository = ProfileImageRepository;
        this.authSharedService = authSharedService;
    }
    async validateToken(access_token) {
        const email = this.jwtService.verify(access_token);
        const UserWithRepository = await this.UserRepository.findOneBy({
            email: email,
        });
        if (UserWithRepository) {
            return "Login Success";
        }
        else {
            throw new common_1.HttpException("Forbidden", common_1.HttpStatus.FORBIDDEN);
        }
    }
    async kakaoLogin(permissionCode, res) {
        const [ok, token] = await GetAccessToken(permissionCode);
        if (!ok) {
            throw new common_1.HttpException("Get Access Token Error", common_1.HttpStatus.UNAUTHORIZED);
        }
        const [ret, user_email] = await GetUserData(token);
        if (!ret) {
            throw new common_1.HttpException("Get User Data Error", common_1.HttpStatus.UNAUTHORIZED);
        }
        let user = { email: user_email };
        const UserWithRepository = await this.UserRepository.findOneBy({
            email: user_email,
        });
        if (UserWithRepository) {
            console.log("UserWithRepository: ", UserWithRepository);
            user = UserWithRepository;
        }
        else {
            const c_user = await this.UserRepository.save(user);
        }
        res.cookie("access_token", this.jwtService.sign({ user }, { secret: process.env.JWT_SECRET_KEY }), { httpOnly: true });
        return res.status(200).json({ user });
    }
    async kakaoSignUp(updateUserDto, res) {
        const user = this.authSharedService.getUser();
        const defaultImage = await this.ProfileImageRepository.findOneBy({
            path: "upload/default.svg",
        });
        if (defaultImage) {
            updateUserDto.profileImage = defaultImage;
        }
        else {
            const saveDefaultImage = await this.ProfileImageRepository.save({
                path: "upload/default.svg",
            });
            updateUserDto.profileImage = saveDefaultImage;
        }
        const rep = await this.UserRepository.update({ id: user.id }, updateUserDto);
        const updateUser = await this.UserRepository.createQueryBuilder("users")
            .leftJoinAndSelect("users.contents", "contents")
            .leftJoinAndSelect("users.profileImage", "images")
            .where({ id: user.id })
            .getOne();
        res.cookie("access_token", this.jwtService.sign({ user }, { secret: process.env.JWT_SECRET_KEY }), { httpOnly: true });
        return res.status(200).json({ updateUser });
    }
    async localSignUp(createAuthLocalDto, res) {
        const UserWithRepository = await this.UserRepository.findOneBy({
            email: createAuthLocalDto.email,
        });
        if (UserWithRepository) {
            throw new common_1.HttpException("Duplicated Email", common_1.HttpStatus.CONFLICT);
        }
        const defaultImage = await this.ProfileImageRepository.findOneBy({
            path: "upload/default.svg",
        });
        if (defaultImage) {
            createAuthLocalDto.profileImage = defaultImage;
        }
        else {
            const saveDefaultImage = await this.ProfileImageRepository.save({
                path: "upload/default.svg",
            });
            createAuthLocalDto.profileImage = saveDefaultImage;
        }
        const user = await this.UserRepository.save(createAuthLocalDto);
        res.cookie("access_token", this.jwtService.sign({ user }, { secret: process.env.JWT_SECRET_KEY }), { httpOnly: true });
        return res.status(200).json({ user });
    }
    async localSignIn(createSignInDto, res) {
        const user = await this.UserRepository.findOneBy({
            email: createSignInDto.email,
        });
        if (!user) {
            throw new common_1.HttpException("Not Exist Email", common_1.HttpStatus.UNAUTHORIZED);
        }
        if (crypto
            .createHash("sha256")
            .update(createSignInDto.password)
            .digest("hex") !== user.password) {
            throw new common_1.HttpException("Invalid Password", common_1.HttpStatus.UNAUTHORIZED);
        }
        res.cookie("access_token", this.jwtService.sign({ user }, { secret: process.env.JWT_SECRET_KEY }), { httpOnly: true });
        return res.status(200).json({ user });
    }
    async logout(res) {
        res.clearCookie("access_token");
        res.sendStatus(200);
    }
};
__decorate([
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "kakaoLogin", null);
__decorate([
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_user_dto_1.UpdateUserDto, Object]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "kakaoSignUp", null);
__decorate([
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_auth_dto_1.CreateAuthLocalDto, Object]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "localSignUp", null);
__decorate([
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_auth_dto_1.CreateSignInLocalDto, Object]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "localSignIn", null);
__decorate([
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "logout", null);
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.Users)),
    __param(2, (0, typeorm_1.InjectRepository)(profileimage_entity_1.ProfileImages)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        auth_shared_service_1.AuthSharedService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map