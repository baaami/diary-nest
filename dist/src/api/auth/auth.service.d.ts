import { JwtService } from "@nestjs/jwt";
import { Users } from "src/api/user/entities/user.entity";
import { ProfileImages } from "src/common/entities/profileimage.entity";
import { Repository } from "typeorm";
import { UpdateUserDto } from "src/api/user/dto/update-user.dto";
import { CreateAuthLocalDto, CreateSignInLocalDto } from "./dto/create-auth.dto";
import { Response } from "express";
import { AuthSharedService } from "./auth.shared.service";
export declare class AuthService {
    private jwtService;
    private UserRepository;
    private ProfileImageRepository;
    private readonly authSharedService;
    constructor(jwtService: JwtService, UserRepository: Repository<Users>, ProfileImageRepository: Repository<ProfileImages>, authSharedService: AuthSharedService);
    validateToken(access_token: string): Promise<string>;
    kakaoLogin(permissionCode: string, res: Response): Promise<Response<any, Record<string, any>>>;
    kakaoSignUp(updateUserDto: UpdateUserDto, res: Response): Promise<Response<any, Record<string, any>>>;
    localSignUp(createAuthLocalDto: CreateAuthLocalDto, res: Response): Promise<Response<any, Record<string, any>>>;
    localSignIn(createSignInDto: CreateSignInLocalDto, res: Response): Promise<Response<any, Record<string, any>>>;
    logout(res: Response): Promise<void>;
}
