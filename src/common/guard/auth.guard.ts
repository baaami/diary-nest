import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Observable } from "rxjs";
import { CreateUserDto } from "src/api/user/dto/create-user.dto";
import { UpdateUserDto } from "src/api/user/dto/update-user.dto";
import { Users } from "src/api/user/entities/user.entity";
import { Repository } from "typeorm";
import { JwtdecodedUser } from "../entities/common.entity";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Users) private userRepository: Repository<Users>
  ) {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    return this.validateUser(request);
  }

  private validateUser(request: any) {
    let cookieType: boolean = false
    let headerType: boolean = false
    if(request.hasOwnProperty("cookies") == true) {
      cookieType = true
    }

    if (request.headers.hasOwnProperty("authorization") == true) {
      headerType = true
    }

    let accessToken: string
    // 쿠키, 헤더로 access token이 들어오지 않을 경우 전부 인증 거부
    // response: 403
    if(cookieType == false && headerType == false ) {
      return false
    }
    
    // 검증할 access token 획득
    if(headerType) {
      accessToken = request.headers.authorization.split("Bearer ")[1];
    } else {
      // headerType이 아닐경우에만 실행 - cookieType일 경우
      accessToken = (request as Request).cookies.access_token;
    }

    // 검증
    console.log("accessToken: ", accessToken)
    const decoded: JwtdecodedUser = this.jwtService.verify(
      accessToken.toString(),
      { secret: process.env.JWT_SECRET_KEY }
    );

    // 검증 실패 혹은 decoding 실패
    if (typeof decoded !== "object" || decoded.hasOwnProperty("user") === false)
      return false;

    // 검증 성공
    request.user = decoded.user;
    console.log("request.user: ", request.user)
    return true;
  }
}
