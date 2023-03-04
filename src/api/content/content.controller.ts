import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
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
import { editFileName, imageFileFilter } from "src/lib/multer/multerOption";
import { ContentService } from "./content.service";
import { CreateContentDto } from "./dto/create-content.dto";
import { UpdateContentDto } from "./dto/update-content.dto";
import { Request } from "express";

@Controller("content")
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @UseGuards(AuthGuard)
  @Get(":id")
  read(@Param("id", ParseIntPipe) contentId: number, @Req() req: Request) {
    console.log(req.body);
    return this.contentService.findOne(contentId);
  }

  @Get("/list")
  list() {
    return this.contentService.findList();
  }

  @Get("/list/:id")
  listUser(@Param("id", ParseIntPipe) userId: number) {
    return this.contentService.findUserList(userId);
  }

  @UseGuards(AuthGuard)
  @Post()
  write(@Body() createContentDto: CreateContentDto, @Req() req: any) {
    return this.contentService.writeOne(createContentDto, req.user);
  }

  @UseGuards(AuthGuard)
  @Post("/image")
  @UseInterceptors(
    FileFieldsInterceptor([{ name: "images", maxCount: 5 }], {
      storage: diskStorage({
        destination: "./upload",
        filename: editFileName,
      }),
    })
  )
  uploadFiles(
    @UploadedFiles() files: { images?: Express.Multer.File[] },
    @Req() req: Request
  ) {
    return this.contentService.uploadFiles(files);
  }

  @Post("/create")
  @UseInterceptors(
    FileFieldsInterceptor([{ name: "images", maxCount: 5 }], {
      storage: diskStorage({
        destination: "./upload",
        filename: editFileName,
      }),
    })
  )
  @UseGuards(AuthGuard)
  create(
    @Body() createContentDto: CreateContentDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
    @Req() req: any
  ) {
    return this.contentService.Create(createContentDto, files, req.user);
  }

  @Patch(":id")
  @UseInterceptors(
    FileFieldsInterceptor([{ name: "images", maxCount: 5 }], {
      storage: diskStorage({
        destination: "./upload",
        filename: editFileName,
      }),
    })
  )
  update(
    @Body() updateContentDto: UpdateContentDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
    @Param("id", ParseIntPipe) contentId: number
  ) {
    return this.contentService.Update(updateContentDto, contentId, files);
  }

  @Delete(":id")
  @HttpCode(204)
  delete(@Param("id", ParseIntPipe) contentId: number) {
    return this.contentService.DeleteOne(contentId);
  }
}
