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
import { BUYER, CHAT_PORT, SELLER, UNKNOWN_USER } from "src/common/define";
import { ChatService } from "./chat.service";
import { Rooms } from "./entities/room.entity";
import { CreateChatDto } from "./dto/create-chat.dto";
import { Users } from "src/api/user/entities/user.entity";

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

  // 채팅방 접속 중인 클라이언트들
  // key: user id
  // value: room id
  private chat_clients = new Map<string, string>();

  printConnectedClients() {
    for (const [key, value] of this.clients.entries()) {
      this.logger.log(`socket id: ${key}`);
      this.logger.log(`user id: ${value}`);
    }
  }

  updateConfirmtiome(userId: string): string {
    return "";
  }

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

    this.printConnectedClients();
  }

  /**
   * @brief User가 로그아웃 시 발생
   * @param socket
   */
  handleDisconnect(@ConnectedSocket() socket: Socket) {
    const socketId = socket.id;
    this.logger.log(`Disconnecting, socket id: ${socketId}`);

    this.clients.delete(socket.id);

    this.printConnectedClients();
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

    // const ExistUnConfirmChat =
    // 내가 들어가있는 room_id의 채팅 목록을 가져온다. 가져올 때 createdAt을 기준으로 최신순으로 가져온다.
    // 조건: send_id가 내가 아닐 경우, 가장 최신 대화목록의 confirm time을 확인한다.

    // bNotiConfirm 알림 안읽은 거 있는지
    socket.emit("login", `login success ${socket.id}: ${userId}`);

    this.printConnectedClients();
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
   * @brief 채팅방 입장 시 발생하는 이벤트
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
    const userId: string = this.clients.get(socket.id);
    if (!userId) {
      this.logger.error("Failed to get user id", userId, socket.id);
    }

    this.chat_clients.set(userId, roomId);

    // Update ConfirmTime
    await this.chatService.confirmChat(Number(userId), room);

    // join이 되어있던 room인지 확인
    const bSocketInRoom = socket.rooms.has(roomId);
    if (bSocketInRoom == false) {
      socket.join(roomId);
    }
    socket.emit("roomId_after_join_room", roomId);
    return;
  }

  /**
   * @brief 채팅방 나가기 시 발생하는 이벤트
   *
   * @param socket socket 인스턴스
   * @param room
   */
  @SubscribeMessage("leave_room")
  async handleOutRoomEvent(
    @ConnectedSocket() socket: Socket,
    @MessageBody() room: Rooms
  ) {
    const userId = this.clients.get(socket.id);
    this.chat_clients.delete(userId);

    this.logger.log("Leave room: ", userId);
    socket.emit("leave_room", "Out room Success");
  }

  /**
   * @brief 채팅방 삭제 시 발생하는 이벤트
   *
   * @param socket socket 인스턴스
   * @param room
   */
  @SubscribeMessage("delete_room")
  async handleLeaveRoomEvent(
    @ConnectedSocket() socket: Socket,
    @MessageBody() room: Rooms
  ) {
    const roomId = String(room.id);

    const bSocketInRoom = socket.rooms.has(roomId);
    if (bSocketInRoom == true) {
      socket.leave(roomId);
      socket.to(roomId).emit("Delete room Success");
      socket.emit("delete_room", roomId);
      this.logger.log("Delete room Success");
    }

    const userId = this.clients.get(socket.id);
    console.log("방을 나간 유저 ID: ", userId);
    try {
      await this.chatService.leaveRoom(Number(userId), Number(roomId));
      const IsLeaveAll = await this.chatService.IsLeaveAll(Number(roomId));
      if (IsLeaveAll) {
        await this.chatService.deleteRoom(room);
      }
    } catch (err) {
      console.error(err);
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
    const room = msgPayload.room;
    const userId = this.clients.get(socket.id);
    const roomId = await this.chatService.getRoomId(msgPayload.room);
    msgPayload.room.id = Number(roomId);
    // 해당 방에 broad cast
    const message = {
      ...msgPayload,
      createdAt: new Date(),
    };

    this.server.to(roomId).emit("message", message);
    this.server.to(roomId).emit("chat_notification", message);

    // socket.broadcast.to(roomId).emit("message", message);
    // 전제 조건 : content_id는 기존에 존재하는 채팅방
    // -> join_room을 통하여 생성
    try {
      await this.chatService.addMessage(msgPayload);
    } catch (err) {
      this.logger.error(`Failed to save messsage ${msgPayload.message}`);
    }

    // if another one join room
    const partnerId = this.chatService.getChatPartner(userId);
    if (this.chat_clients.has(partnerId)) {
      try {
        // Update ConfirmTime
        this.logger.log(
          `메시지: ${msgPayload.message}를 ${partnerId}가 읽었습니다.`
        );
        await this.chatService.confirmChat(Number(userId), room);
      } catch (err) {
        this.logger.error("Failed to update confirm chatting time");
      }
    }
    return;
  }

  // 알림 기능 구현
  async sendReviewNotification(seller: Users, buyer: Users, review: string) {
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
