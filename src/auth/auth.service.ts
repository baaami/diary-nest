import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as qs from 'qs'
import axios, { AxiosResponse } from 'axios';
import { KakaoServerData, KakaoServerResponse, KakaoServerUserData } from 'src/common/entities/common.entity';

async function GetAccessToken(permissionCode: string): Promise<[boolean, string]>{
  let bRtn: boolean = true
  let ResData: KakaoServerData
  const ResKakako: AxiosResponse<any, any>  = await axios({
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

  if(!ResKakako.data) bRtn = false
  else ResData = ResKakako.data;

  const access_token: string = ResData.access_token

  return [bRtn, access_token]
}

async function GetUserData(access_token :string): Promise<[boolean, string]> {
  let bRtn: boolean = true
  let ResData: KakaoServerUserData
  const ResKakako: AxiosResponse<any, any>  = await axios({
    method: 'get',
    url: 'https://kapi.kakao.com/v2/user/me',
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    params: {
      property_keys: ["kakao_account.profile"],
    },
  })

  if(!ResKakako.data) bRtn = false
  else ResData = ResKakako.data;

  console.log("ResData: ", ResData)

  return [bRtn, ResData.kakao_account.email]
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
    let user_email: string;
    // 0. 인가 코드 유효성 검사 (카카오에 전달 후 access_token 확인)
    let [ok, token] = await GetAccessToken(permissionCode)
    if(!ok) {
      throw new HttpException('Server Error', HttpStatus.UNAUTHORIZED)
    }

    // 2. access_token 유저 확인
    [ok, user_email] = await GetUserData(token)
    if(!ok) {
      throw new HttpException('Server Error', HttpStatus.UNAUTHORIZED)
    }

    // 3. 회원/비회원에 따른 처리 로직

    // 4. user email을 기반으로 토큰 생성

    const payload = { email: user_email };
    console.log("payload: ", payload)
    return {
      access_token: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET_KEY }),
    };
  }
}
