import { Controller, Get } from '@nestjs/common';

@Controller('post')
export class PostController {
    constructor() {}
    @Get()
    read(): string {
        return "hello";
    }
}