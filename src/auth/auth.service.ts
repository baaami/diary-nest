import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/user/entities/user.entity';
import { UserController } from 'src/user/user.controller';
import { Repository } from 'typeorm';
import qs from 'querystring'
import axios, { AxiosResponse } from 'axios';
import { KakaoServerResponse } from 'src/common/entities/common.entity';

function GetAccessToken(permissionCode: string): [boolean, string] {
  const bRtn: boolean = false

  const oTokenFromkakao: Promise<AxiosResponse<KakaoServerResponse, string>> = axios({
    method: 'POST',
    url: 'https://kauth.kakao.com/oauth/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify({
      grant_type: 'authorization_code',
      client_id: process.env.KAKAO_ID,
      redirect_uri: process.env.KAKAO_CALLBACK_URL,
      code: permissionCode,
    }),
  })

  const {access_token} = oTokenFromkakao.data;

  return [bRtn, access_token]
}

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

  async kakaologin(permissionCode: string) {
    const email = "lgh121546@naver.com"

    // 0. 인가 코드 유효성 검사 (카카오에 전달 후 access_token 확인)
    const [ok, token] = GetAccessToken(permissionCode)

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
