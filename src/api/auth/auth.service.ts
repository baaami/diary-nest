import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "src/api/user/entities/user.entity";
import { Repository } from "typeorm";
import * as qs from "qs";
import axios, { AxiosResponse } from "axios";
import {
  KakaoServerData,
  KakaoServerUserData,
} from "src/common/entities/common.entity";
import { CreateUserDto } from "src/api/user/dto/create-user.dto";
import { UpdateUserDto } from "src/api/user/dto/update-user.dto";
import { CreateAuthLocalDto } from "./dto/create-auth.dto";

async function GetAccessToken(
  permissionCode: string
): Promise<[boolean, string]> {
  let bRtn = true;
  let kakaoServerData: KakaoServerData;
  const kakaoServerTotalData: AxiosResponse<any, any> = await axios({
    method: "POST",
    url: "https://kauth.kakao.com/oauth/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: qs.stringify({
      grant_type: "authorization_code",
      client_id: process.env.KAKAO_ID,
      redirect_uri: process.env.KAKAO_CALLBACK_URL,
      code: permissionCode,
    }),
  });

  if (!kakaoServerTotalData.data) bRtn = false;
  else kakaoServerData = kakaoServerTotalData.data;

  const access_token: string = kakaoServerData.access_token;

  return [bRtn, access_token];
}

async function GetUserData(access_token: string): Promise<[boolean, string]> {
  let bRtn = true;
  let kakaoServerData: KakaoServerUserData;
  const kakaoServerTotalData: AxiosResponse<any, any> = await axios({
    method: "get",
    url: "https://kapi.kakao.com/v2/user/me",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    params: {
      property_keys: ["kakao_account.profile"],
    },
  });

  if (!kakaoServerTotalData.data) bRtn = false;
  else kakaoServerData = kakaoServerTotalData.data;

  return [bRtn, kakaoServerData.kakao_account.email];
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Users) private UserRepository: Repository<Users>
  ) {}

  async validateToken(access_token: string) {
    const email = this.jwtService.verify(access_token);

    // email이 db에 존재하는지 확인
    const UserWithRepository = await this.UserRepository.findOneBy({
      email: email,
    });
    if (UserWithRepository) {
      return "Login Success";
    } else {
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    }
  }

  async kakaoLogin(permissionCode: string) {
    // 1. 인가 코드 유효성 검사 (카카오에 전달 후 access_token 확인)
    const [ok, token] = await GetAccessToken(permissionCode);
    if (!ok) {
      throw new HttpException("Server Error", HttpStatus.UNAUTHORIZED);
    }

    // 2. access_token 유저 확인
    const [ret, user_email] = await GetUserData(token);
    if (!ret) {
      throw new HttpException("Server Error", HttpStatus.UNAUTHORIZED);
    }

    let user: CreateUserDto | UpdateUserDto = { email: user_email };

    // 3.1 회원, 비회원 확인
    // email이 db에 존재하는지 확인
    const UserWithRepository = await this.UserRepository.findOneBy({
      email: user_email,
    });
    if (UserWithRepository) {
      // 존재할 경우, 존재하는 user data로 전송
      console.log("UserWithRepository: ", UserWithRepository);
      user = UserWithRepository;
    } else {
      // c_user : create_user
      // u_user : update_user
      // d_user : delete_user
      const c_user = await this.UserRepository.save(user);
      console.log(c_user);
    }

    // 4. user email을 기반으로 토큰 생성
    return {
      token: this.jwtService.sign(
        { user },
        { secret: process.env.JWT_SECRET_KEY }
      ),
      user: user,
    };
  }

  /**
   * 회원이 기존에 존재할 경우 : 사용 중인 이메일이라는 response를 줘야함
   * 존재하지 않을 경우 : DB 저장 및 회원가입 완료
   * @param createAuthLocalDto: local 회원가입 데이터 형식
   * @returns response 데이터
   */
  async localSignUp(createAuthLocalDto: CreateAuthLocalDto) {
    // 1 회원, 비회원 확인
    // email이 db에 존재하는지 확인
    const UserWithRepository = await this.UserRepository.findOneBy({
      email: createAuthLocalDto.email,
    });
    if (UserWithRepository) {
      // 존재할 경우, 사용 중인 이메일이라는 response를 줘야함
      throw new HttpException("Duplicated Email", HttpStatus.CONFLICT);
    }

    // c_user : create_user
    // u_user : update_user
    // d_user : delete_user
    const user: Users = await this.UserRepository.save(createAuthLocalDto);
    console.log(user);

    return {
      token: this.jwtService.sign(
        { user },
        { secret: process.env.JWT_SECRET_KEY }
      ),
      user: user,
    };
  }

  async localSignIn(createAuthLocalDto: CreateAuthLocalDto) {
    // 1 회원, 비회원 확인
    // email이 db에 존재하는지 확인
    const UserWithRepository = await this.UserRepository.findOneBy({
      email: createAuthLocalDto.email,
    });
    if (UserWithRepository) {
      // 존재할 경우, 사용 중인 이메일이라는 response를 줘야함
      throw new HttpException("Duplicated Email", HttpStatus.CONFLICT);
    }

    // c_user : create_user
    // u_user : update_user
    // d_user : delete_user
    const user: Users = await this.UserRepository.save(createAuthLocalDto);
    console.log(user);

    return {
      token: this.jwtService.sign(
        { user },
        { secret: process.env.JWT_SECRET_KEY }
      ),
      user: user,
    };
  }
}
