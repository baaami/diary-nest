import { Logger } from "@nestjs/common";
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
import { Server } from "http";
import { from, map, Observable } from "rxjs";
import { Namespace, Socket } from "socket.io";
import { CHAT_PORT } from "src/common/define";

interface ChatRoom {
  roomId: string;
  sellerId: number;
  buyerId: number;
}
interface MessagePayload {
  roomId: string;
  message: string;
}

const getRoomName = (room: ChatRoom): string => {
  return room.roomId + "-" + room.buyerId;
};
// namespace를 'chat' 으로 설정
// 프론트 측에서 http://localhost:4000/chat에서 '/chat'에 해당되는 부분
@WebSocketGateway(CHAT_PORT, {
  cors: {
    origin: "http://localhost:3000",
  },
})
export class EventGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger("Gateway");
  private rooms: ChatRoom[] = [];
  // key: Socket id
  // value: user id
  private clients = new Map<string, string>();

  // 초기화 이후에 실행
  afterInit() {
    this.logger.log("웹소켓 서버 초기화 ✅");
  }

  /**
   * @brief User가 채팅방 입장 시 발생
   * @param socket
   */
  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`${socket.id} 소켓 연결`);
    // who are you -> emit
  }

  /**
   * @brief User가 채팅방 나가기 시 발생
   * @param socket
   */
  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`${socket.id} 소켓 연결 해제 ❌`);

    this.clients.delete(socket.id);
  }

  /**
   * @brief 사용자가 로그인 시 웹 소켓을 통하여 자신 id를 1회 등록한다.
   *
   * @param socket socket 인스턴스
   * @param userId 유저 식별자
   */
  handleWhoAreYou(
    @ConnectedSocket() socket: Socket,
    @MessageBody() userId: string
  ) {
    this.clients.set(socket.id, userId);
  }

  /**
   * @brief User가 특정 채팅방에 접속 후 곧바로 송신
   *
   * @param socket
   * @param msgRoom
   * @returns
   */
  @SubscribeMessage("roomIn")
  handleInEvent(
    @ConnectedSocket() socket: Socket,
    // data: 상품 글 id
    @MessageBody() msgRoom: ChatRoom
  ) {
    const { roomId, sellerId, buyerId } = msgRoom;

    let room: ChatRoom = this.rooms.find((r) => r.roomId === roomId);
    // 기존에 방이 없는 경우
    if (!room) {
      room = {
        roomId,
        sellerId,
        buyerId,
      };

      if (roomId) this.rooms.push(room);
      else {
        socket.emit("joinedRoom", "방만들기 실패");
        return;
      }
    }

    socket.join(getRoomName(room));

    // 조인 성공 이벤트를 해당 클라이언트에게 보냄
    socket.emit("joinedRoom", "Join 성공");

    console.log("현재 방 List");
    for (let temp of this.rooms) {
      console.log("Room: ", temp.roomId);
    }
    return;
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
  handleMessageEvent(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { roomId, message }: MessagePayload
  ) {
    console.log("message: ", message);
    // 메시지 처리
    const room = this.rooms.find((r) => r.roomId === roomId);
    if (room) {
      // TODO: 방 안에 있는 사람들한테 해야됨
      // 해당 방에 있는 모든 클라이언트에게 메시지 전송
      socket.emit("messageReceived", { roomId: roomId, message: message });

      // room
      socket.to(getRoomName(room)).emit(message);
    }
    return;
  }

  @SubscribeMessage("roomOut")
  handleOutEvent(
    @ConnectedSocket() socket: Socket,
    @MessageBody() msgRoom: ChatRoom
  ) {
    const { roomId, sellerId, buyerId } = msgRoom;
    let room: ChatRoom = this.rooms.find((r) => r.roomId === roomId);

    socket.leave(getRoomName(room));

    return;
  }
}
