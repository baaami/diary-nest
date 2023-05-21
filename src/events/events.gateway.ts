import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from "@nestjs/websockets";
import { Server } from "http";
import { from, map, Observable } from "rxjs";
import { Namespace, Socket } from "socket.io";

// namespace를 'chat' 으로 설정
// 프론트 측에서 http://localhost:4000/chat에서 '/chat'에 해당되는 부분
@WebSocketGateway(8080)
@WebSocketGateway({
  namespace: "chat",
  cors: {
    origin: "*",
  },
})
export class EventGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  // @WebSocketServer()
  // server: Server;
  @WebSocketServer() nsp: Namespace;

  // 초기화 이후에 실행
  afterInit() {
    this.nsp.adapter.on("create-room", (room) => {
      console.log(`"Room:${room}"이 생성되었습니다.`);
    });

    this.nsp.adapter.on("join-room", (room, id) => {
      console.log(`"Socket:${id}"이 "Room:${room}"에 참여하였습니다.`);
    });

    this.nsp.adapter.on("leave-room", (room, id) => {
      console.log(`"Socket:${id}"이 "Room:${room}"에서 나갔습니다.`);
    });

    this.nsp.adapter.on("delete-room", (roomName) => {
      console.log(`"Room:${roomName}"이 삭제되었습니다.`);
    });

    console.log("웹소켓 서버 초기화 ✅");
  }

  // 소켓 연결이 되면 실행
  handleConnection(@ConnectedSocket() socket: Socket) {
    console.log(`${socket.id} 소켓 연결`);
  }

  // 소켓 연결이 끊기면 실행
  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log(`${socket.id} 소켓 연결 해제 ❌`);
  }

  // 비동기식 응답
  @SubscribeMessage("events")
  onEvent(client: Socket, data: any): Observable<WsResponse<number>> {
    console.log("data: ", data);
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: "events", data: item }))
    );
  }

  // 동기식 응답
  @SubscribeMessage("identity")
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }

  @SubscribeMessage("chat")
  handleEvent(@ConnectedSocket() socket: Socket, @MessageBody() data: string) {
    socket.broadcast.emit("message", { username: socket.id, data });
    return { username: socket.id, data };
  }
}
