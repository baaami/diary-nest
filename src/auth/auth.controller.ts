import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}
  
  @Post('/api/auth//callback/kakao')
  read(@Body() permissionCode: string) {
    return this.authService.kakaologin(permissionCode);
  }
}
