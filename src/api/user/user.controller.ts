import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { AuthGuard } from "src/common/guard/auth.guard";
import { CreateProfileImageDto } from "src/common/dto/create-profile-image.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserService } from "./user.service";
import { editFileName } from "src/lib/multer/multerOption";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 특정 유저 조회
  @Get("/find/:id")
  getOne(@Param("id", ParseIntPipe) userId: number) {
    return this.userService.findOne(userId);
  }

  // 특정 유저 닉네임 조회
  @Get("/find/nickname/:id")
  getnickname(@Param("id", ParseIntPipe) userId: number) {
    return this.userService.findNickName(userId);
  }

  // 로그인 상태 유지
  @UseGuards(AuthGuard)
  @Post("/islogin")
  islogin() {
    return this.userService.islogin();
  }

  // 유저 정보 업데이트
  @UseGuards(AuthGuard)
  @Post("/info")
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto);
  }

  // 프로필 정보 업데이트
  @UseGuards(AuthGuard)
  @Post("/profile")
  @UseInterceptors(
    FileFieldsInterceptor([{ name: "profileImage", maxCount: 1 }], {
      storage: diskStorage({
        destination: "./upload",
        filename: editFileName,
      }),
    })
  )
  updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFiles() files: { profileImage?: Express.Multer.File[] }
  ) {
    return this.userService.updateProfile(updateProfileDto, files);
  }
}
