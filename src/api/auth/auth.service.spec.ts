import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { jwtConstants } from './constant';
import * as ormconfig from '../../../ormconfig';
import { Repository } from 'typeorm';

import { UserModule } from '../user/user.module';
import { Users } from '../user/entities/user.entity';
import { Contents } from '../content/entities/content.entity';
import { Images } from 'src/common/entities/image.entity';

describe('AuthService', () => {
  let service: AuthService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([Users, Contents, Images]),
        TypeOrmModule.forRoot(ormconfig),
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '60h' },
        }),
      ],
      providers: [AuthService, UserService, JwtService, Repository<Users>],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
