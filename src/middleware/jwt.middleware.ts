import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/api/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtMiddleWare implements NestMiddleware<Request, Response> {
  constructor(
    private readonly jwtService: JwtService,    // 토큰을 object로 해독하기 위함
    @InjectRepository(Users) private userRepository: Repository<Users>,
  ) { }
  async use(req: Request, res: Response, next: NextFunction) {
    if ('authorization' in req.headers) {
      const token = req.headers['authorization'];
      try {
        // 토큰을 object로 변경한다.
        const decoded = this.jwtService.verify(token.toString());

        // email_id 가 들어있는지 확인
        if (typeof decoded === 'object' && decoded.hasOwnProperty('user')) {
          const member = await this.userRepository.findOneBy({'email': decoded.user.email});
          //   const { ok, memberInfo } = await this.userService.findOne();  
          if (member) {
            req.body['userId'] = member.id;
            next();
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      res.send(401)
    }
  }
}
