import { Controller, Get } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(
    // private readonly userService: UserService
) {}
  @Get()
  getOne() {
    // return this.userService.findOne();
    return "hi"
  }
}
