import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/user/entities/user.entity';
import { UserController } from 'src/user/user.controller';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Users) private UserRepository: Repository<Users>
  ) {}

  async validateToken(access_token: string) {
    const email = this.jwtService.verify(access_token)

    // email이 db에 존재하는지 확인
    const UserWithRepository = await this.UserRepository.findOneBy({"email" : email});
    if(UserWithRepository) {
      return "Login Success"
    } else {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
    }
  }

  async kakaologin(access_token: string) {
    const email = "lgh121546@naver.com"
    // 1. access_token 유효성 검사

    // 2. access_token 유저 확인

    // 3. 회원/비회원에 따른 처리 로직

    // 4. user email을 기반으로 토큰 생성

    let user :Users
    user.email = email


    const payload = { email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
