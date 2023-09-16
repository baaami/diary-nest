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
import {
  BUYER,
  CHAT_PORT,
  NOTI_TYPE_REVIEW,
  NOT_LOGIN_USER,
  SELLER,
  UNKNOWN_ROOM_ID,
  UNKNOWN_USER,
} from "src/common/define";
import { ChatService } from "./chat.service";
import { Rooms } from "./entities/room.entity";
import { CreateChatDto } from "./dto/create-chat.dto";
import { Users } from "src/api/user/entities/user.entity";
import { RoomService } from "src/api/room/rooms.service";
import { CreateRoomDto } from "./dto/create-room.dto";
import { PairUserIdRoomId } from "src/common/entities/common.entity";
import { Reviews } from "src/api/review/entities/review.entity";
import { NotificationService } from "src/api/notification/notification.service";
import { Notificaitions } from "src/api/notification/entity/notification.entity";
import { CreateNotification } from "src/api/notification/dto/create-notification.dto";

// namespace를 'chat' 으로 설정
@WebSocketGateway(CHAT_PORT, {
  cors: {
    origin: "http://localhost:3000",
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly chatService: ChatService,
    private readonly roomService: RoomService,
    private readonly notificationService: NotificationService
  ) {} // @InjectRepository
  private logger = new Logger("ChatGateway");

  @WebSocketServer()
  server: Server;

  // key: socket id
  // value: user id
  // socket id는 중복 체크가 되는데 user id도 1개만 접속이 되어있어야하는 것 아닐까??
  // -> 이게 맞는 것일 수도
  private clients = new Map<string, string>();

  // 채팅방 접속 중인 클라이언트들
  private chat_clients = new Set<string>();

  getUserId(socketId: string): string {
    return this.clients.get(socketId);
  }

  getSocketIdByUserId(userId: number): string|number {
    for (const [sid, uid] of this.clients.entries()) {
      console.log('sid',sid)
      console.log('uid',uid)
      if (uid == String(userId)) return sid;
    }

    return NOT_LOGIN_USER;
  }

  joinChattingRoom(userId: string, roomId: string) {
    this.logger.log(`${userId}번 님이 ${roomId}번 채팅방에 참가하셨습니다`);
    this.chat_clients.add(JSON.stringify({ userId, roomId }));
    console.log("채팅방 접속중인 client들", this.chat_clients);
  }

  leaveChattingRoom(userId: string, roomId: string) {
    this.logger.log(`${userId}번 님이 ${roomId}번 채팅방을 떠났습니다`);
    this.chat_clients.delete(JSON.stringify({ userId, roomId }));
  }

  IsNotJoinChatList(roomId: number): boolean {
    if (roomId == UNKNOWN_ROOM_ID) return true;
    return false;
  }

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

  validationUserId(userId: any) {
    if (userId) {
      return true;
    }
    return false;
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

    // 로그아웃 하지 않고 종료 시 삭제
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
    // Define Local Variable
    if (this.validationUserId(userId) == false) {
      this.logger.error(`userId is Invalid, userId: ${userId}`);
    }
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
   * @param room
   * @returns
   */
  @SubscribeMessage("join_room")
  async handleJoinRoomEvent(
    @ConnectedSocket() socket: Socket,
    // data: 상품 글 id
    @MessageBody() createRoomDto: CreateRoomDto
  ) {
    let room: Rooms;
    // Confirm Room Exist
    room = await this.roomService.findExistRoom(createRoomDto);
    if (!room) {
      // Room Not Exist
      room = await this.roomService.createRoom(createRoomDto);
    }

    // Define Local Variable
    const userId: string = this.getUserId(socket.id);
    const roomId: string = String(room.id);

    // Update ConfirmTime
    await this.chatService.confirmChat(Number(userId), room);

    // Join Room (Map)
    this.joinChattingRoom(userId, String(roomId));
    console.log("confirm_join_room에 userId 전송", userId);
    socket.to(roomId).emit("confirm_join_room", userId);

    // Join Room (Socket)
    const bSocketInRoom = socket.rooms.has(String(roomId));
    if (bSocketInRoom == false) {
      socket.join(String(roomId));
    }
    socket.emit("roomId_after_join_room", String(roomId));

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
    @MessageBody() roomId: number
  ) {
    // Define Local Variable
    const userId = this.getUserId(socket.id);

    // Leave Room
    this.leaveChattingRoom(userId, String(roomId));

    // Response
    socket.emit(
      "leave_room",
      `${userId}번 님이 ${roomId}번 채팅방을 떠났습니다`
    );
  }

  /**
   * @brief 채팅방 삭제 시 발생하는 이벤트
   *
   * @param socket socket 인스턴스
   * @param roomId
   */
  @SubscribeMessage("delete_room")
  async handleLeaveRoomEvent(
    @ConnectedSocket() socket: Socket,
    @MessageBody() roomId: number
  ) {
    // Define Local Variable
    const userId = this.getUserId(socket.id);
    const room = await this.chatService.getRoomById(roomId);
    const sRoomId = String(roomId);

    // Socket Leave Room
    const bSocketInRoom = socket.rooms.has(sRoomId);
    if (bSocketInRoom == true) {
      // Response
      socket
        .to(sRoomId)
        .emit(`${userId}번 님이 ${roomId}번 채팅방을 나갔습니다`);

      socket.emit("delete_room", sRoomId);
      this.logger.log(`${userId}번 님이 ${roomId}번 채팅방을 나갔습니다`);

      socket.leave(sRoomId);
    }

    // Delete Room in DB
    try {
      await this.chatService.leaveRoom(Number(userId), roomId);
      const IsLeaveAll = await this.chatService.IsLeaveAll(roomId);
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
    const userId = this.getUserId(socket.id);
    const roomId = await this.chatService.getRoomId(msgPayload.room);
    msgPayload.room.id = Number(roomId);
    const room = await this.chatService.getRoomById(Number(roomId));
    const partnerId = this.chatService.getChatPartner(userId, room);
    if (partnerId == UNKNOWN_USER) {
      this.logger.error(`Failed to getChatPartner Unknown User`);
    }
    const partnerSockertId = this.getSocketIdByUserId(partnerId);

    // 해당 방에 broad cast
    const message = {
      ...msgPayload,
      createdAt: new Date(),
    };

    this.server.to(roomId).emit("message", message);

    if (partnerSockertId != NOT_LOGIN_USER) {
      console.log('partnerSockertId',partnerSockertId)
      this.server
        .to(String(partnerSockertId))
        .emit("chat_notification", message);
        console.log('파트너에게 채팅알림 전송')
    } else {
      this.logger.log(`${partnerId}번 님이 로그인 상태가 아닙니다.`);
    }

    // Save Message to Database
    try {
      await this.chatService.addMessage(msgPayload);
    } catch (err) {
      this.logger.error(`Failed to save messsage ${msgPayload.message}`);
    }

    // if another one join room, update confirmtime
    await this.chatService.confirmChat(Number(userId), room);

    this.logger.log(`${userId} -> ${partnerId} : ${msgPayload.message}`);
    if (this.chat_clients.has(JSON.stringify({ userId: partnerId, roomId }))) {
      try {
        this.logger.log(
          `메시지: ${msgPayload.message}를 ${partnerId}가 읽었습니다.`
        );
        await this.chatService.confirmChat(Number(partnerId), room);
        this.server.to(roomId).emit("confirm_message", {
          confirmTime: new Date(),
          partnerId: partnerId,
        });
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

    try {
      const notification = new CreateNotification();

      notification.type = NOTI_TYPE_REVIEW;
      notification.msg = review;
      notification.receiver = seller;
      notification.notifier = buyer;

      await this.notificationService.createNotification(notification);
    } catch (err) {}

    this.server.to(socketId).emit("notification", {
      review,
    });
  }
}
