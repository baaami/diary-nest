import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/lib/multerOption';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Controller('content')
export class ContentController {
    constructor(
        private readonly contentService: ContentService
    ) {}

    @Get(':id')
    read(@Param('id') contentId: number) {
        return this.contentService.findOne(contentId);
    }

    @Get('/list')
    list() {
        return this.contentService.findList();
    }

    @Get('/list/:id')
    listUser(@Param('id') userId: number) {
        return this.contentService.findUserList(userId);
    }

    @Post()
    write(@Body() createContentDto: CreateContentDto) {
        return this.contentService.writeOne(createContentDto);
    }

    @Post('/image')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'images', maxCount: 2 }
    ]))
    image(@UploadedFiles() files: {images?: Express.Multer.File[]}) {
        console.log("files??: ", files)
        return this.contentService.uploadFiles(files);
    }

    @Post('/imageWithContent')
    @UseInterceptors(FileInterceptor('files', {
        storage: diskStorage({
          destination: './upload',
          filename: editFileName
        }),
        fileFilter: imageFileFilter
    }))    
    writewithImage(@Body() createContentDto: CreateContentDto, @UploadedFiles() files: Array<Express.Multer.File>) {
        return this.contentService.writeWithUploadFiles( createContentDto, files);
    }
    
    @Patch(':id')
    update(@Body() updateContentDto: UpdateContentDto, @Param('id') contentId: number) {
        return this.contentService.UpdateOne(updateContentDto, contentId);
    }

    @Delete(':id')
    @HttpCode(204)
    delete(@Param('id') contentId: number) {
        return this.contentService.DeleteOne(contentId);
    }    
}