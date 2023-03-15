import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateAuthKakaoDto, CreateAuthLocalDto, CreateSignInLocalDto } from "./dto/create-auth.dto";

@Controller("/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/kakao")
  kakao(@Body() createAuthKakaoDto: CreateAuthKakaoDto) {
    return this.authService.kakaoLogin(createAuthKakaoDto.code);
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
