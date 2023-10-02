import { UpdateUserDto } from "../user/dto/update-user.dto";
import { AuthService } from "./auth.service";
import { CreateAuthKakaoDto, CreateAuthLocalDto, CreateSignInLocalDto } from "./dto/create-auth.dto";
import { Response } from "express";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    kakao(createAuthKakaoDto: CreateAuthKakaoDto, res: Response): Promise<Response<any, Record<string, any>>>;
    kakaoSignUp(updateUserDto: UpdateUserDto, res: Response): Promise<Response<any, Record<string, any>>>;
    signin(createSignInLocalDto: CreateSignInLocalDto, res: Response): Promise<Response<any, Record<string, any>>>;
    signup(createAuthLocalDto: CreateAuthLocalDto, res: Response): Promise<Response<any, Record<string, any>>>;
    logout(res: Response): Promise<void>;
}
