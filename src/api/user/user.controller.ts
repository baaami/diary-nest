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
import { CreateImageDto } from "src/common/dto/create-image.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserService } from "./user.service";
import { editFileName } from "src/lib/multer/multerOption";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  // 특정 유저 조회
  @Get("/find/:id")
  getOne(@Param("id", ParseIntPipe) userId: number) {
    return this.userService.findOne(userId);
  }

  // 특정 유저 닉네임 조회
  @Get("/find/:id")
  getnickname(@Param("id", ParseIntPipe) userId: number) {
    return this.userService.findNickName(userId);
  }

  // 로그인 상태 유지
  @UseGuards(AuthGuard)
  @Post("/islogin")
  islogin(@Req() req: any) {
    return this.userService.islogin(req.user);
  }

  // 유저 정보 업데이트
  @UseGuards(AuthGuard)
  @Post("/info")
  update(@Body() updateUserDto: UpdateUserDto, @Req() req: any) {
    return this.userService.update(updateUserDto, req.user);
  }

  // 프로필 이미지 업로드
  @UseGuards(AuthGuard)
  @Post("/profile/image")
  @UseInterceptors(
    FileFieldsInterceptor([{ name: "images", maxCount: 5 }], {
      storage: diskStorage({
        destination: "./upload",
        filename: editFileName,
      }),
    })
  )
  uploadProfile(@UploadedFiles() files: { images?: Express.Multer.File[] }, @Req() req: any) {
    return this.userService.uploadProfile(files, req.user);
  }
}
