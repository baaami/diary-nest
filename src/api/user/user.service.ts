import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository, UpdateResult } from "typeorm";
import { Users } from "src/api/user/entities/user.entity";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateImageDto } from "src/common/dto/create-image.dto";
import { Images } from "src/common/entities/image.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private UserRepository: Repository<Users>,
    @InjectRepository(Images) private ImageRepository: Repository<Images>,
  ) {}
  async findOne(userId: number): Promise<Users> {
    const user = await this.UserRepository.createQueryBuilder("users")
    .leftJoinAndSelect('users.contents', 'contents') 
    .leftJoinAndSelect('users.images', 'images')
    .where({ id: userId })
    .getOne();
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
        id: Not(user_exclude_Id),
      },
    });
    const randomIndex = Math.floor(Math.random() * users.length);
    return users[randomIndex];
  }

  async insertFakerData(testuser: Users): Promise<Users> {
    const res = await this.UserRepository.save(testuser);
    return res;
  }

  async update(
    updateUserDto: UpdateUserDto,
    user: Users
  ): Promise<void> {
    const rep = await this.UserRepository.update(
      { id: user.id },
      updateUserDto
    );

    throw new HttpException('User updated successfully', HttpStatus.OK);
  }

  async uploadProfile(files: { images?: Express.Multer.File[] }, user: Users) {
    const { images } = files;

    if (images) {
      // console.log(images)
      images.forEach((image: Partial<CreateImageDto>) => {
        image.user = user;
        // 이미지 db에 저장
        console.log(image)
        this.ImageRepository.save(image);
      });
    } else {
      console.log("image not found");
    } 
  }
}
