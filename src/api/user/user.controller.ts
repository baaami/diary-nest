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
  @Get("/find/:id")
  getOne(@Param("id", ParseIntPipe) userId: number) {
    return this.userService.findOne(userId);
  }

  @UseGuards(AuthGuard)
  @Post("/islogin")
  islogin(@Req() req: any) {
    return this.userService.islogin(req.user);
  }

  @UseGuards(AuthGuard)
  @Post("/info")
  update(@Body() updateUserDto: UpdateUserDto, @Req() req: any) {
    return this.userService.update(updateUserDto, req.user);
  }

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
