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

interface ChatRoom {
  roomId: string;
  sellerId: number;
  buyerId: number;
}
interface MessagePayload {
  roomId: string;
  message: string;
}

// namespace를 'chat' 으로 설정
// 프론트 측에서 http://localhost:4000/chat에서 '/chat'에 해당되는 부분
@WebSocketGateway(8080, {
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

  // 소켓 연결이 되면 실행
  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`${socket.id} 소켓 연결`);
    // who are you -> emit
  }

  // 소켓 연결이 끊기면 실행
  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`${socket.id} 소켓 연결 해제 ❌`);
  }

  // 소켓 연결이 되면 실행
  handleWhoAreYou(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: string
  ) {
    // TODO: map을 사용할지, interface를 사용할지?
    // -> map을 쓰는 것이 좋을 것 같음
    // 소켓 id와 user id를 Array에 추가
  }

  @SubscribeMessage("join")
  handleInEvent(
    @ConnectedSocket() socket: Socket,
    // data: 상품 글 id
    @MessageBody() { roomId, sellerId, buyerId }: ChatRoom
  ) {
    console.log("socket.id : ", socket.id);
    console.log("in data: ", roomId);

    let room: ChatRoom = this.rooms.find((r) => r.roomId === roomId);
    if (!room) {
      room = {
        roomId,
        sellerId,
        buyerId,
      };

      this.rooms.push(room);

      socket.join(roomId);
    }

    socket.join(roomId);

    // 조인 성공 이벤트를 해당 클라이언트에게 보냄
    socket.emit("joinedRoom", room);

    console.log("현재 방 List");
    for (let temp of this.rooms) {
      console.log("Room: ", temp.roomId);
    }
    return;
  }

  @SubscribeMessage("message")
  // data: 채팅방 id, message 내용
  handleMessageEvent(
    @MessageBody() { roomId, message }: MessagePayload
  ): string {
    // 메시지 처리
    console.log("message data: ", message);
    return message;
  }

  @SubscribeMessage("out")
  handleOutEvent(@MessageBody() data: string): string {
    console.log("out data: ", data);

    // 채팅방 삭제
    return data;
  }
}
