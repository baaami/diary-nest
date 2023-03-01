import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Users } from 'src/api/user/entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private UserRepository: Repository<Users>,
  ) {}
  async findOne(userId: number): Promise<Users> {
    const user = await this.UserRepository.findOneBy({ id: userId });
    return user;
  }

  async findlatest(): Promise<Users> {
    const rep = await this.UserRepository.find();
    return rep[0];
  }

  async update(
    updateUserDto: UpdateUserDto,
    user: Users,
  ): Promise<UpdateResult> {
    const rep = await this.UserRepository.update(
      { id: user.id },
      updateUserDto,
    );

    return rep;
  }
}
