import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from 'src/api/user/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private UserRepository: Repository<Users>,
  ) {}
  async findOne(userId: number) {
    const UserWithRepository = await this.UserRepository.findOneBy({ id: userId });
    return UserWithRepository;
  }
}
