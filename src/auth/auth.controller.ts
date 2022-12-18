import { Controller, Get, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor() {}
  @Post('/callback/kakao')
  read(): string {
    return 'kakao hello';
  }
}
