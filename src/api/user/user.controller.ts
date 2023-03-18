import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "src/common/guard/auth.guard";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get("/find/:id")
  getOne(@Param("id", ParseIntPipe) userId: number) {
    return this.userService.findJoinOne(userId);
  }

  @UseGuards(AuthGuard)
  @Post("/info")
  update(@Body() updateUserDto: UpdateUserDto, @Req() req: any) {
    return this.userService.update(updateUserDto, req.user);
  }
}
