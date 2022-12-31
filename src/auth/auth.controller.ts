import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('/callback/kakao')
  read(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.kakaologin(createAuthDto.code);
  }
}
