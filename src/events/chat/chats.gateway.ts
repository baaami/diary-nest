import { Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketServer,
  WsResponse,
  WebSocketGateway,
} from "@nestjs/websockets";
import { Namespace, Server, Socket } from "socket.io";
import { BUYER, CHAT_PORT, SELLER } from "src/common/define";
import { ChatService } from "./chat.service";
import { Rooms } from "./entities/room.entity";
import { CreateChatDto } from "./dto/create-chat.dto";
import { Users } from "src/api/user/entities/user.entity";
import { CreateReviewDto } from "src/api/review/dto/create-review.dto";

// namespace를 'chat' 으로 설정
@WebSocketGateway(CHAT_PORT, {
  cors: {
    origin: "http://localhost:3000",
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly chatService: ChatService) {} // @InjectRepository
  private logger = new Logger("ChatGateway");

  @WebSocketServer()
  server: Server;

  // key: socket id
  // value: user id
  // socket id는 중복 체크가 되는데 user id도 1개만 접속이 되어있어야하는 것 아닐까??
  // -> 이게 맞는 것일 수도
  private clients = new Map<string, string>();

  // 초기화 이후에 실행
  afterInit() {
    this.logger.log(`Initialize Web Socket Server [${CHAT_PORT}]`);
  }

  /**
   * @brief User가 로그인 시 발생
   * @param socket
   */
  handleConnection(@ConnectedSocket() socket: Socket) {
    const socketId = socket.id;
    this.logger.log(`New connecting, socket id: ${socketId}`);

    this.clients.set(socketId, "");
  }

  /**
   * @brief User가 로그아웃 시 발생
   * @param socket
   */
  handleDisconnect(@ConnectedSocket() socket: Socket) {
    const socketId = socket.id;
    this.logger.log(`Disconnecting, socket id: ${socketId}`);

    this.clients.delete(socket.id);
  }

  /**
   * @brief 사용자가 로그인 시 웹 소켓을 통하여 자신 id를 1회 등록
   *        참가되어있는 모든 방에 join한다.
   *
   * @param socket socket 인스턴스
   * @param userId 유저 식별자
   */
  @SubscribeMessage("login")
  async handleLogin(
    @ConnectedSocket() socket: Socket,
    @MessageBody() userId: string
  ) {
    // TODO: Validation check userID
    this.clients.set(socket.id, userId);

    console.log("login client id: ", userId);

    // User가 사용하고 있는 room들에 모두 join한다.
    const joined_room_list: Rooms[] = await this.chatService.getJoinedRoomList(
      Number(userId)
    );

    console.log(`id: ${userId}, join room list`, joined_room_list);

    const joined_room_id_list = await Promise.all(
      joined_room_list.map((joined_room) => {
        return this.chatService.getRoomId(joined_room);
      })
    );

    // User가 속해있는 room들을 DB에서 획득
    socket.join(joined_room_id_list);

    // TODO: 아래 정보 포함해서 보내주기
    // bchatConfirm 채팅방 안읽은 것있는지

    const ExistUnConfirmChat =
      // 내가 들어가있는 room_id의 채팅 목록을 가져온다. 가져올 때 createdAt을 기준으로 최신순으로 가져온다.
      // 조건: send_id가 내가 아닐 경우, 가장 최신 대화목록의 confirm time을 확인한다.

      // bNotiConfirm 알림 안읽은 거 있는지
      socket.emit("login", `login success ${socket.id}: ${userId}`);
  }

  /**
   * @brief 사용자가 logout 시 웹 소켓을 통하여 자신 id를 delete
   *        참가되어있는 모든 방에 leave 한다.
   *
   * @param socket socket 인스턴스
   * @param userId 유저 식별자
   */
  @SubscribeMessage("logout")
  async handleLogout(
    @ConnectedSocket() socket: Socket,
    @MessageBody() userId: string
  ) {
    this.clients.delete(socket.id);

    // User가 사용하고 있는 room들에 모두 join한다.
    const joined_room_list: Rooms[] = await this.chatService.getJoinedRoomList(
      Number(userId)
    );

    const joined_room_id_list = await Promise.all(
      joined_room_list.map((joined_room) => {
        return this.chatService.getRoomId(joined_room);
      })
    );

    joined_room_id_list.forEach((room_id) => {
      socket.leave(room_id);
    });
  }

  /**
   * @brief 채팅하기 버튼 클릭 시 발생하는 이벤트
   *
   * @param socket socket 인스턴스
   * @param interMsgRoom
   * @returns
   */
  @SubscribeMessage("join_room")
  async handleJoinRoomEvent(
    @ConnectedSocket() socket: Socket,
    // data: 상품 글 id
    @MessageBody() room: Rooms
  ) {
    const roomId: string = await this.chatService.getRoomId(room);

    const clientId = Number(this.clients.get(socket.id));
    if (clientId == room.buyer_id) {
      this.chatService.updateConfirmTime(room.id, BUYER);
    } else if (clientId == room.seller_id) {
      this.chatService.updateConfirmTime(room.id, SELLER);
    } else if (clientId == 0) {
      console.log("Not Login User Access");
    } else {
      console.log("Unknown User");
    }

    // join이 되어있던 room인지 확인
    const bSocketInRoom = socket.rooms.has(roomId);
    if (bSocketInRoom == false) {
      socket.join(roomId);
    }
    socket.emit("roomId_after_join_room", roomId);
    return;
  }

  /**
   * @brief 채팅방 삭제 시 발생하는 이벤트
   *
   * @param socket socket 인스턴스
   * @param room
   */
  @SubscribeMessage("leave_room")
  async handleLeaveRoomEvent(
    @ConnectedSocket() socket: Socket,
    @MessageBody() room: Rooms
  ) {
    const roomId: string = await this.chatService.getRoomId(room);
    await this.chatService.deleteRoom(Number(roomId));

    const bSocketInRoom = socket.rooms.has(roomId);
    if (bSocketInRoom == true) {
      socket.leave(roomId);
      socket.to(roomId).emit("success leave room");
    }
  }

  /**
   * @brief User가 특정 채팅방에 접속되어 있을 때 채팅 msg를 송/수신하면 호출
   *
   * @param socket
   * @param msgRoom
   * @returns
   */
  @SubscribeMessage("message")
  // data: 채팅방 id, message 내용
  async handleMessageEvent(
    @ConnectedSocket() socket: Socket,
    @MessageBody() msgPayload: CreateChatDto
  ) {
    const room_id = await this.chatService.getRoomId(msgPayload.room);
    msgPayload.room.id = Number(room_id);
    // 해당 방에 broad cast
    const message = {
      ...msgPayload,
      createdAt: new Date(),
    };

    this.server.to(room_id).emit("message", message);
    this.server.to(room_id).emit("chat_notification", message);

    // socket.broadcast.to(room_id).emit("message", message);
    // 전제 조건 : content_id는 기존에 존재하는 채팅방
    // -> join_room을 통하여 생성
    await this.chatService.addMessage(msgPayload);
    return;
  }

  // 알림 기능 구현
  async sendNotification(seller: Users, buyer: Users, review: CreateReviewDto) {
    let socketId: string = "";
    for (const [key, value] of this.clients.entries()) {
      if (value === String(seller.id)) {
        socketId = key;
        break;
      }
    }

    if (socketId && socketId.length != 0) {
      console.error("seller dosen't connect socket", seller);
      return;
    }

    this.server.to(socketId).emit("notification", {
      seller,
      buyer,
      review,
    });
  }
}
