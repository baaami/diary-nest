import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { ChatService } from "src/events/chat/chat.service";

@Controller("room")
export class RoomController {
  constructor(private readonly chatService: ChatService) {}

  @Get("/list/:id")
  async getList(@Param("id", ParseIntPipe) userId: number) {
    return this.chatService.getJoinedRoomList(userId);
  }

  @Get("/:id")
  async getRoom(@Param("id", ParseIntPipe) roomId: number) {
    return this.chatService.getRoomInfo(roomId);
  }
}
