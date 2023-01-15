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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from 'src/lib/auth/jwt.guard';
import { editFileName, imageFileFilter } from 'src/lib/multer/multerOption';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @UseGuards(AuthGuard)
  @Get(':id')
  read(@Param('id', ParseIntPipe) contentId: number) {
    return this.contentService.findOne(contentId);
  }

  @Get('/list')
  list() {
    return this.contentService.findList();
  }
  
  @Get('/list/:id')
  listUser(@Param('id', ParseIntPipe) userId: number) {
    return this.contentService.findUserList(userId);
  }

  @Post()
  write(@Body() createContentDto: CreateContentDto) {
    return this.contentService.writeOne(createContentDto);
  }

  @Post('/image')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 5 }], {
    storage: diskStorage({
      destination: './upload',
      filename: editFileName,
    })
  }))
  image(@UploadedFiles() files: { images?: Express.Multer.File[] }) {
    return this.contentService.uploadFiles(files);
  }

  @Post('/imageWithContent')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 2 }], {
    storage: diskStorage({
      destination: './upload',
      filename: editFileName,
    })    
  }))
  writewithImage(
    @Body() createContentDto: CreateContentDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    return this.contentService.writeWithUploadFiles(createContentDto, files);
  }

  @Patch(':id')
  update(
    @Body() updateContentDto: UpdateContentDto,
    @Param('id', ParseIntPipe) contentId: number,
  ) {
    return this.contentService.UpdateOne(updateContentDto, contentId);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id', ParseIntPipe) contentId: number) {
    return this.contentService.DeleteOne(contentId);
  }
}
