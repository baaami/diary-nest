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
  Query,
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
import { ContentList } from "src/common/entities/common.entity";

@UseGuards(AuthGuard)
@Controller("content")
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  // 검색 게시물 리스트

  // 게시물 리스트 Default
  @Get("/search")
  async searchContentByKeyword(
    @Query("keyword") keyword: string,
    @Query("page") page: number = 0
  ) {
    if (isNaN(page)) page = 0;
    const [contents, totalPage] =
      await this.contentService.searchContentByKeyword(keyword, page);
    const result: ContentList = {
      contents,
      totalPage,
    };
    return result;
  }

  // 게시물 리스트
  @Get("/list")
  async list(@Query("page") page: number = 0) {
    if (isNaN(page)) page = 0;

    const [contents, totalPage] = await this.contentService.findList(page);
    const result: ContentList = {
      contents,
      totalPage,
    };
    return result;
  }

  // 판매 중인 게시물 리스트
  @Get("/list/user/selling/:id")
  async sellingList(
    @Param("id", ParseIntPipe) userId: number,
    @Query("page") page: number = 0
  ) {
    if (isNaN(page)) page = 0;
    const [contents, totalPage] =
      await this.contentService.getSellingProductsByUser(userId, page);
    const result: ContentList = {
      contents,
      totalPage,
    };
    return result;
  }

  // 판매 완료된 게시물 리스트
  @Get("/list/user/sold/:id")
  async soldList(
    @Param("id", ParseIntPipe) userId: number,
    @Query("page") page: number = 0
  ) {
    if (isNaN(page)) page = 0;
    const [contents, totalPage] =
      await this.contentService.getSoldProductsByUser(userId, page);
    const result: ContentList = {
      contents,
      totalPage,
    };
    return result;
  }

  // 로그인한 유저가 구매한 게시물 리스트

  @Post("/list/bought/:id")
  async boughtList(@Query("page") page: number = 0) {
    if (isNaN(page)) page = 0;
    const [contents, totalPage] =
      await this.contentService.getBoughtProductList(page);
    const result: ContentList = {
      contents,
      totalPage,
    };
    return result;
  }

  // 특정 카테고리 게시물 리스트

  @Get("/list/category")
  async categoryList(
    @Query("category") category: string,
    @Query("page") page: number = 0
  ) {
    if (isNaN(page)) page = 0;
    const [contents, totalPage] =
      await this.contentService.getProductsByCategory(category, page);
    const result: ContentList = {
      contents,
      totalPage,
    };
    return result;
  }

  // 상세 게시물 조회
  @Get("/read/:id")
  read(@Param("id", ParseIntPipe) contentId: number) {
    return this.contentService.findOne(contentId);
  }

  // 상세 게시물 등록
  @Post("/create")
  @UseInterceptors(
    FileFieldsInterceptor([{ name: "images", maxCount: 5 }], {
      storage: diskStorage({
        destination: "./upload",
        filename: editFileName,
      }),
    })
  )
  create(
    @Body() createContentDto: CreateContentDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] }
  ) {
    return this.contentService.Create(createContentDto, files);
  }

  @Post("/complete/:id")
  complete(@Param("id", ParseIntPipe) contentId: number) {
    return this.contentService.complete(contentId);
  }

  @Post()
  write(@Body() createContentDto: CreateContentDto) {
    return this.contentService.writeOne(createContentDto);
  }

  // 상세 게시물 업데이트
  @Patch("/update/:id")
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

  // 상세 게시물 삭제
  @Delete("/delete/:id")
  @HttpCode(204)
  delete(@Param("id", ParseIntPipe) contentId: number) {
    return this.contentService.DeleteOne(contentId);
  }
}
