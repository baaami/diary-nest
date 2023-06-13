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

interface Room {
  title: string;
  contentId: number;
  sellerId: number;
  clientId: number;
}
interface MessagePayload {
  roomName: string;
  message: string;
}

let createdRooms: Room[] = [];

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

  // 초기화 이후에 실행
  afterInit() {
    this.logger.log("웹소켓 서버 초기화 ✅");
  }

  // 소켓 연결이 되면 실행
  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`${socket.id} 소켓 연결`);
  }

  // 소켓 연결이 끊기면 실행
  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`${socket.id} 소켓 연결 해제 ❌`);
  }

  @SubscribeMessage("events")
  handleEvent(@MessageBody() data: string): string {
    console.log("data: ", data);
    return data;
  }
}
