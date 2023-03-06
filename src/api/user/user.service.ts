import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository, UpdateResult } from "typeorm";
import { Users } from "src/api/user/entities/user.entity";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private UserRepository: Repository<Users>
  ) {}
  async findOne(userId: number): Promise<Users> {
    const user = await this.UserRepository.findOneBy({ id: userId });
    return user;
  }

  async findlatest(): Promise<Users> {
    const rep = await this.UserRepository.find();
    return rep[0];
  }

  async findRandomOne(): Promise<Users> {
    const users = await this.UserRepository.find({});
    const randomIndex = Math.floor(Math.random() * users.length);
    return users[randomIndex];
  }

  async findExcludeRandomOne(user_exclude_Id: number): Promise<Users> {
    const users = await this.UserRepository.find({
      where: {
        id: Not(user_exclude_Id)
      }
    });
    const randomIndex = Math.floor(Math.random() * users.length);
    return users[randomIndex];
  }

  async insertFakerData(testuser: Users): Promise<Users> {
    const res = await this.UserRepository.save(testuser);
    return res
  }

  async update(
    updateUserDto: UpdateUserDto,
    user: Users
  ): Promise<UpdateResult> {
    const rep = await this.UserRepository.update(
      { id: user.id },
      updateUserDto
    );

    return rep;
  }
}
