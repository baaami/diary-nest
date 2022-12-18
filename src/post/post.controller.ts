import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('post')
export class PostController {
    constructor(
        private readonly postService: PostService
    ) {}

    @Get(':id')
    read(@Param('id') postId: number) {
        return this.postService.findOne(postId);
    }

    @Post()
    write(@Body() createPostDto: CreatePostDto) {
        return this.postService.PostOne(createPostDto);
    }
    
    @Patch()
    update(): string {
        return "hello";
    }
    @Delete()
    delete(): string {
        return "hello";
    }    
}