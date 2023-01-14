import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtMiddleWare implements NestMiddleware<Request, Response> {
  constructor(
    private readonly jwtService: JwtService, // 토큰을 object로 해독하기 위함
    private readonly userService: UserService, // 사용자 id로 full정보를 얻기 위함
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if ('authorization' in req.headers) {
      const token = req.headers['authorization'];
      try {
        // 토큰을 object로 변경한다.
        const decoded = this.jwtService.verify(token.toString());
        // email_id 가 들어있는지 확인
        if (typeof decoded === 'object' && decoded.hasOwnProperty('email')) {
          // TODO : email을 통하여 find 해야함
          const member = await this.userService.findOne();
          //   const { ok, memberInfo } = await this.userService.findOne();
          if (member) req['member'] = member;
        }
      } catch (error) {
        console.log(error);
      }
    }
    next();
  }
}
