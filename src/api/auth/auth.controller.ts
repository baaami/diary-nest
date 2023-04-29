import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "src/common/guard/auth.guard";
import { UpdateUserDto } from "../user/dto/update-user.dto";
import { AuthService } from "./auth.service";
import {
  CreateAuthKakaoDto,
  CreateAuthLocalDto,
  CreateSignInLocalDto,
} from "./dto/create-auth.dto";
import { Response } from "express";

@Controller("/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 카카오 로그인
  @Post("/kakao")
  kakao(@Body() createAuthKakaoDto: CreateAuthKakaoDto, @Res() res: Response) {
    return this.authService.kakaoLogin(createAuthKakaoDto.code, res);
  }

  // 카카오 회원 가입
  @UseGuards(AuthGuard)
  @Post("/kakao/signup")
  kakaoSignUp(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any,
    @Res() res: Response
  ) {
    return this.authService.kakaoSignUp(updateUserDto, req.user, res);
  }

  // 로컬 로그인
  @Post("/local/signin")
  signin(
    @Body() createSignInLocalDto: CreateSignInLocalDto,
    @Res() res: Response
  ) {
    return this.authService.localSignIn(createSignInLocalDto, res);
  }

  // 로컬 회원 가입
  @Post("/local/signup")
  signup(@Body() createAuthLocalDto: CreateAuthLocalDto, @Res() res: Response) {
    return this.authService.localSignUp(createAuthLocalDto, res);
  }

  // 로그 아웃
  @Post("/logout")
  logout(@Res() res: Response) {
    return this.authService.logout(res);
  }
}
