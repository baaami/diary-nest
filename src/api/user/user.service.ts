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
import { CreateProfileImageDto } from "src/common/dto/create-profile-image.dto";
import { ProfileImages } from "src/common/entities/profileimage.entity";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import path, { join } from "path";
import { unlink } from "fs";
import { AuthSharedService } from "../auth/auth.shared.service";
import { UpdateLocationDto } from "./dto/update-location.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private UserRepository: Repository<Users>,
    @InjectRepository(ProfileImages)
    private ProfileImageRepository: Repository<ProfileImages>,
    private readonly authSharedService: AuthSharedService
  ) {}
  async findOne(userId: number): Promise<Users> {
    const user = await this.UserRepository.createQueryBuilder("users")
      .leftJoinAndSelect("users.contents", "contents")
      .leftJoinAndSelect("users.profileImage", "profileImage")
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
      .leftJoinAndSelect("users.profileImage", "profileImage")
      .where({ id: user.id })
      .getOne();
    console.log('user res정보',res)
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
        .leftJoinAndSelect("users.profileImage", "profileImage")
        .where({ id: user.id })
        .getOne();
    } catch (err) {
      console.error(err);
    }
  }

@HttpCode(204)
async updateLocation(updateLocationDto: UpdateLocationDto) {
  try {
    // 추출한 데이터
    const { latitude, longitude, location } = updateLocationDto;

    // 사용자 정보 가져오기
    const user = await this.authSharedService.getUser();

    // 사용자 정보 업데이트
    user.latitude = latitude;
    user.longitude = longitude;
    user.location = location;

    // 업데이트된 사용자 정보를 데이터베이스에 저장
    const updatedUser = await this.UserRepository.save(user)
    return updatedUser

  } catch (err) {
    console.error(err);
  }
}

  @HttpCode(204)
  async updateProfile(
    updateProfileDto: UpdateProfileDto,
    files: { profileImage?: Express.Multer.File[] }
  ): Promise<Users> {
    const loginedUser = this.authSharedService.getUser();
    console.log("files: ", files);
    const { profileImage } = files;

    // 프로필 이미지가 존재할 경우
    if (profileImage) {
      /* 이전 프로필 이미지 삭제 */
      const preUser = await this.UserRepository.createQueryBuilder("users")
        .where({ id: loginedUser.id })
        .leftJoinAndSelect("users.profileImage", "profileImage")
        .getOne();

      // 업데이트할 content의 image를 서버에서 전부삭제
      if (
        preUser.profileImage &&
        preUser.profileImage.path != "upload/default.svg"
      ) {
        const image = await this.ProfileImageRepository.createQueryBuilder(
          "profileimages"
        )
          .where({ path: preUser.profileImage.path })
          .getOne();

        if (image) {
          const deleteFilePath = join(__dirname, "../../../../", image.path);

          unlink(deleteFilePath, (err) => {
            if (err) {
              console.error(err);
              return;
            }
            console.log(
              `File ${deleteFilePath} has been deleted successfully.`
            );
          });

          const delete_path = preUser.profileImage.path;

          preUser.profileImage = null;
          await this.UserRepository.save(preUser);

          await this.ProfileImageRepository.delete({
            path: delete_path,
          });
        }
      }

      /* 새로운 프로필 저장 */
      let imageDto: CreateProfileImageDto = {
        path: profileImage[0].path,
        users: [],
      };
      imageDto.users.push(loginedUser);

      const newProfileImage = await this.ProfileImageRepository.save(imageDto);
      updateProfileDto.profileImage = newProfileImage;
    } else {
      console.log("image not found");
    }

    await this.UserRepository.update({ id: loginedUser.id }, updateProfileDto);

    const user = await this.UserRepository.createQueryBuilder("users")
      .leftJoinAndSelect("users.contents", "contents")
      .leftJoinAndSelect("users.profileImage", "profileImage")
      .where({ id: loginedUser.id })
      .getOne();

    return user;
  }

  async getDefaultImage(): Promise<ProfileImages> {
    // 기본 이미지 설정
    const defaultImage = await this.ProfileImageRepository.findOneBy({
      path: "upload/default.svg",
    });

    // 기본이미지가 DB에 존재할 경우, 기본 이미지 그대로 사용
    if (defaultImage) {
      return defaultImage;
    } else {
      // 기본이미지가 DB에 존재하지 않을 경우, 기본 이미지 save 후 사용
      // 반드시 upload 폴더에는 default.svg가 존재해야함
      const saveDefaultImage = await this.ProfileImageRepository.save({
        path: "upload/default.svg",
      });

      return saveDefaultImage;
    }
  }
}
