import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) userId: number) {
    return this.userService.findOne(userId);
  }
}
