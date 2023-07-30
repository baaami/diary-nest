import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Chats } from "./entities/chat.entity";
import { Rooms } from "./entities/room.entity";
import { CreateRoomDto } from "./dto/create-room.dto";

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Rooms) private RoomRepository: Repository<Rooms>,
    @InjectRepository(Chats) private ChatRepository: Repository<Chats>
  ) {} // @InjectRepository

  /**
   * @brief          전달된 Room의 식별자 전달
   *
   * @param room     찾고자하는 혹은 추가할 Room 인터페이스
   * @returns        찾고자하는 혹은 추가된 Room Id
   */
  async getRoomId(room: Rooms | CreateRoomDto): Promise<string> {
    let target_room: Rooms = await this.RoomRepository.findOneBy({
      content_id: room.content_id,
    });

    if (target_room == null) {
      target_room = this.RoomRepository.create(room as CreateRoomDto);
    }

    return String(target_room.id);
  }

  /**
   * @brief             전달된 User가 참가하여 있는 Room List 전달
   *
   * @param     userId  User 식별자
   * @returns           찾고자하는 Room List
   */
  async getJoinedRoomList(userId: number): Promise<Rooms[]> {
    let target_room_list: Rooms[] = await this.RoomRepository.find({
      where: [
        {
          buyer_id: userId,
        },
        {
          seller_id: userId,
        },
      ],
    });

    return target_room_list;
  }

  /**
   * @brief             전달된 메시지를 DB에 저장
   *
   * @param
   * @returns
   */
  async addMessage() {}
}
