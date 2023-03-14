import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from "@nestjs/websockets";
import { Socket } from "dgram";
import { Server } from "http";
import { from, map, Observable } from "rxjs";

@WebSocketGateway(8080)
@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class EventGateway {
  @WebSocketServer()
  server: Server;

  // 비동기식 응답
  @SubscribeMessage("events")
  onEvent(client: Socket, data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: "events", data: item }))
    );
  }

  // 동기식 응답
  @SubscribeMessage("identity")
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }

  handleConnection(client: any) {
    console.log("Client connected");
  }

  handleDisconnect(client: any) {
    console.log("Client disconnected");
  }

  @SubscribeMessage("chat")
  handleEvent(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket
  ): string {
    return data;
  }
}
