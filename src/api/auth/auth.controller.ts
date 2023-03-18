import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/common/guard/auth.guard";
import { UpdateUserDto } from "../user/dto/update-user.dto";
import { AuthService } from "./auth.service";
import { CreateAuthKakaoDto, CreateAuthLocalDto, CreateSignInLocalDto } from "./dto/create-auth.dto";

@Controller("/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/kakao")
  kakao(@Body() createAuthKakaoDto: CreateAuthKakaoDto) {
    return this.authService.kakaoLogin(createAuthKakaoDto.code);
  }

  @UseGuards(AuthGuard)
  @Post("/kakao/signup")
  kakaoSignUp(@Body() updateUserDto: UpdateUserDto, @Req() req: any) {
    return this.authService.kakaoSignUp(updateUserDto, req.user);
  }

  @Post("/local/signup")
  signup(@Body() createAuthLocalDto: CreateAuthLocalDto) {
    return this.authService.localSignUp(createAuthLocalDto);
  }

  @Post("/local/signin")
  signin(@Body() createSignInLocalDto: CreateSignInLocalDto) {
    return this.authService.localSignIn(createSignInLocalDto);
  }
}
