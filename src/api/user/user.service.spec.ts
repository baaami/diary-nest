import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { Contents } from '../content/entities/content.entity';
import { Images } from 'src/common/entities/image.entity';

import { UserController } from './user.controller';
import * as ormconfig from '../../../ormconfig'
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: UserService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        imports: [
            TypeOrmModule.forFeature([Users, Contents, Images]),
            TypeOrmModule.forRoot(ormconfig),
          ],
        providers: [UserService, AuthService, JwtService],
    }).compile();
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Upload User form', () => {
    it('upload user', async () => {
      // given : 테스트를 하기 위한 환경 구성
      let user: Users;
      
      // 1. db 내 가장 이전에 가입한 사용자 획득
      

      // when : 테스트 함수 실행

      // then : 테스트 함수 결과
        // const result = await service.update()
        // expect(result).toBeInstanceOf(Array)
    })
})
});