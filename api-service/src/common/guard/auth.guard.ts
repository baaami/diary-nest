import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { JwtdecodedUser } from "../entities/common.entity";
import { Request } from "express";
import { AuthSharedService } from "src/api/auth/auth.shared.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authSharedService: AuthSharedService
  ) {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    return this.validateUser(request);
  }

  private validateUser(request: any) {
    let cookieType: boolean = false;
    let headerType: boolean = false;
    if (request.hasOwnProperty("cookies") == true) {
      if (request.cookies.access_token) {
        cookieType = true;
      }
    }

    if (request.headers.hasOwnProperty("authorization") == true) {
      headerType = true;
    }
    let accessToken: string;

    // 쿠키, 헤더로 access token이 들어오지 않을 경우
    if (cookieType == false && headerType == false) {
      // GET 요청의 경우 비로그인 사용자에게 인가를 허용해준다.
      if ((request as Request).method === "GET") {
        this.authSharedService.setLogined(false);
        return true;
      }

      // response: 403
      return false;
    }

    // 검증할 access token 획득
    if (headerType) {
      accessToken = request.headers.authorization.split("Bearer ")[1];
    } else {
      // headerType이 아닐경우에만 실행 - cookieType일 경우
      accessToken = (request as Request).cookies.access_token;
    }

    if (!accessToken) {
      return false;
    }

    // 검증
    try {
      const decoded: JwtdecodedUser = this.jwtService.verify(
        accessToken.toString(),
        { secret: process.env.JWT_SECRET_KEY }
      );

      // 검증 실패 혹은 decoding 실패
      if (
        typeof decoded !== "object" ||
        decoded.hasOwnProperty("user") === false
      )
        return false;

      // 검증 성공

      // Singleton Service에 로그인 여부 등록
      this.authSharedService.setLogined(true);

      // Singleton Service에 로그인 유저 등록
      this.authSharedService.setUser(decoded.user);
      return true;
    } catch (err) {
      // 잘못된 access token을 보냈으므로 login 하라고 알려줘야함
      if ((request as Request).method === "GET") {
        this.authSharedService.setLogined(false);
        return true;
      }

      // response: 403
      return false;
    }
  }
}
