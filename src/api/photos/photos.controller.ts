import { Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('photos')
export class PhotosController {
  @Post('upload')
  @UseInterceptors(FilesInterceptor('photos'))
  async uploadPhotos(@UploadedFiles() files: Express.Multer.File[]) {
    const uploadFiles: string[] = [];
    console.log('전달받은 files',files)
    for (const file of files) {
      const { buffer,originalname } = file;
      const parts = originalname.split('.');
      const ext = parts[parts.length - 1];
      const newName = 'upload/image_' + Date.now() + '.' + ext;
      const uploadPath = path.join(__dirname, '..','..','..','..', newName); // 경로 수정
      // 파일 데이터를 지정된 경로에 저장
      console.log('_dirname',path.dirname)
      console.log('uploadPath',uploadPath)
      await fs.writeFile(uploadPath, buffer,(err) => {
        if (err) throw err;
        console.log('The file has been saved!');
      }); 
      uploadFiles.push(newName);
    }

    return uploadFiles;
  }
}
