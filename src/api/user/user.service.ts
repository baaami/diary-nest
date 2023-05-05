import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository, UpdateResult } from "typeorm";
import { Users } from "src/api/user/entities/user.entity";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateImageDto } from "src/common/dto/create-image.dto";
import { Images } from "src/common/entities/image.entity";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private UserRepository: Repository<Users>,
    @InjectRepository(Images) private ImageRepository: Repository<Images>
  ) {}
  async findOne(userId: number): Promise<Users> {
    const user = await this.UserRepository.createQueryBuilder("users")
      .leftJoinAndSelect("users.contents", "contents")
      .leftJoinAndSelect("users.images", "images")
      .where({ id: userId })
      .getOne();

    if (!user.images) {
      user.images = {
        id: 999999,
        filename: "",
        path: "upload/default.svg",
        fieldname: "",
        originalname: "",
        encoding: "",
        mimetype: "",
        destination: "",
        size: null,
        createdAt: null,
        updatedAt: null,
        content: null,
        user: null,
      };
    }

    return user;
  }

  async findNickName(userId: number): Promise<string> {
    const user = await this.UserRepository.createQueryBuilder("users")
      .where({ id: userId })
      .getOne();
    return user.nickname;
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

  async islogin(user: Users): Promise<Users> {
    const res = await this.UserRepository.createQueryBuilder("users")
      .leftJoinAndSelect("users.contents", "contents")
      .leftJoinAndSelect("users.images", "images")
      .where({ id: user.id })
      .getOne();

    if (!res.images) {
      console.log("hi");
      res.images = {
        id: 999999,
        filename: "",
        path: "upload/default.svg",
        fieldname: "",
        originalname: "",
        encoding: "",
        mimetype: "",
        destination: "",
        size: null,
        createdAt: null,
        updatedAt: null,
        content: null,
        user: null,
      };
    }

    console.log("res: ", res);
    return res;
  }

  @HttpCode(204)
  async update(updateUserDto: UpdateUserDto, user: Users) {
    const rep = await this.UserRepository.update(
      { id: user.id },
      updateUserDto
    );

    await this.UserRepository.createQueryBuilder("users")
      .leftJoinAndSelect("users.contents", "contents")
      .leftJoinAndSelect("users.images", "images")
      .where({ id: user.id })
      .getOne();
  }

  @HttpCode(204)
  async updateProfile(
    updateProfileDto: UpdateProfileDto,
    files: { images?: Express.Multer.File[] },
    user: Users
  ) {
    const { images } = files;

    if (images) {
      // console.log(images)
      images.forEach((image: Partial<CreateImageDto>) => {
        image.user = user;
        // 이미지 db에 저장
        console.log(image);
        this.ImageRepository.save(image);
      });
    } else {
      console.log("image not found");
    }

    await this.UserRepository.update({ id: user.id }, updateProfileDto);
  }
}
