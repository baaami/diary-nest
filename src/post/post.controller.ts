import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';

@Controller('post')
export class PostController {
    constructor() {}
    @Get()
    read(): string {
        return "hello";
    }
    @Post()
    write(): string {
        return "hello";
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