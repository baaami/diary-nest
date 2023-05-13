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
import { join } from "path";
import { unlink } from "fs";
import { AuthSharedService } from "../auth/auth.shared.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private UserRepository: Repository<Users>,
    @InjectRepository(Images) private ImageRepository: Repository<Images>,
    private readonly authSharedService: AuthSharedService
  ) {}
  async findOne(userId: number): Promise<Users> {
    const user = await this.UserRepository.createQueryBuilder("users")
      .leftJoinAndSelect("users.contents", "contents")
      .leftJoinAndSelect("users.images", "images")
      .where({ id: userId })
      .getOne();

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

  async islogin(): Promise<Users> {
    const user = this.authSharedService.getUser();
    const res = await this.UserRepository.createQueryBuilder("users")
      .leftJoinAndSelect("users.contents", "contents")
      .leftJoinAndSelect("users.images", "images")
      .where({ id: user.id })
      .getOne();

    return res;
  }

  @HttpCode(204)
  async update(updateUserDto: UpdateUserDto) {
    const user = this.authSharedService.getUser();
    try {
      await this.UserRepository.update({ id: user.id }, updateUserDto);
    } catch (err) {
      console.error(err);
    }

    try {
      await this.UserRepository.createQueryBuilder("users")
        .leftJoinAndSelect("users.contents", "contents")
        .leftJoinAndSelect("users.images", "images")
        .where({ id: user.id })
        .getOne();
    } catch (err) {
      console.error(err);
    }
  }

  @HttpCode(204)
  async updateProfile(
    updateProfileDto: UpdateProfileDto,
    files: { images?: Express.Multer.File[] }
  ) {
    const user = this.authSharedService.getUser();
    const { images } = files;

    // 프로필 이미지가 존재할 경우
    if (images) {
      console.log("images: ", images);
      /* 이전 프로필 이미지 삭제 */
      const preUser = await this.UserRepository.createQueryBuilder("contents")
        .where({ id: user.id })
        .getOne();

      // 업데이트할 content의 image를 서버에서 전부삭제
      const image = await this.ImageRepository.createQueryBuilder("images")
        .where({ user: preUser })
        .getOne();

      if (image) {
        const deleteFilePath = join(__dirname, "../../../../", image.path);

        unlink(deleteFilePath, (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(`File ${deleteFilePath} has been deleted successfully.`);
        });

        await this.ImageRepository.delete({
          user: preUser,
        });
      }

      /* 새로운 프로필 저장 */
      images.forEach((image: Partial<CreateImageDto>) => {
        image.user = user;
        this.ImageRepository.save(image);
      });
    } else {
      console.log("image not found");
    }

    await this.UserRepository.update({ id: user.id }, updateProfileDto);
  }
}
