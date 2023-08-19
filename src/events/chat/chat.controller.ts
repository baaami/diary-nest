import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatList } from "src/common/entities/common.entity";

@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get("/list/:id")
  async getList(
    @Query("page") page: number = 0,
    @Param("id", ParseIntPipe) roomId: number
  ) {
    const [chat_list, totalPage] = await this.chatService.getChatList(
      page,
      roomId
    );

    const result: ChatList = {
      chat_list,
      totalPage,
    };

    return result;
  }

  @Get("/latest/:id")
  async getLatestOne(@Param("id", ParseIntPipe) roomId: number) {
    const result = await this.chatService.getChatLatest(roomId);

    return result;
  }
}
