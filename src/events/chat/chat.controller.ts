import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { ChatService } from "./chat.service";

@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get("/list/:id")
  async getList(
    @Query("page") page: number = 0,
    @Param("id", ParseIntPipe) roomId: number
  ) {
    return this.chatService.getChatList(page, roomId);
  }
}
