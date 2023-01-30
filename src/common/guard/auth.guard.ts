import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { CreateUserDto } from 'src/api/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/api/user/dto/update-user.dto';
import { Users } from 'src/api/user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtdecodedUser } from '../entities/common.entity';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Users) private userRepository: Repository<Users>,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateUser(request);
  }

  private validateUser(request: any) {
    if (request.headers.hasOwnProperty('authorization') == false) {
      return false
    }
    // 검증할 access token 획득
    const accessToken = request.headers.authorization.split('Bearer ')[1];


    // 검증
    const decoded: JwtdecodedUser = this.jwtService.verify(accessToken.toString(),
    { secret: process.env.JWT_SECRET_KEY });

    // 검증 실패 혹은 decoding 실패
    if (typeof decoded !== 'object' || decoded.hasOwnProperty('user') === false) return false

    // 검증 성공
    request.user = decoded.user
    return true;
  }
}
