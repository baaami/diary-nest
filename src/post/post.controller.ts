import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

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
    
    @Patch(':id')
    update(@Body() updatePostDto: UpdatePostDto, @Param('id') postId: number) {
        return this.postService.UpdateOne(updatePostDto, postId);
    }

    @Delete(':id')
    delete(@Param('id') postId: number) {
        return this.postService.DeleteOne(postId);
    }    
}