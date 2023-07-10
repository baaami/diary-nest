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
import { Namespace, Socket } from "socket.io";
import { PUSH_PORT } from "src/common/define";

interface Notification {
  notificationId: string;
  userId: number;
  message: string;
}

@WebSocketGateway(PUSH_PORT, {
  cors: {
    origin: "http://localhost:3000",
  },
})
export class PushGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger("PushGateway");
  private notifications: Notification[] = [];

  // key: Socket id
  // value: user id
  private clients = new Map<string, string>();

  afterInit() {
    this.logger.log("웹소켓 서버 초기화 ✅");
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`${socket.id} 소켓 연결`);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`${socket.id} 소켓 연결 해제 ❌`);

    this.clients.delete(socket.id);
  }

  /**
   * @brief User가 로그인 시 발생
   *
   * @param socket User의 socket 인스턴스
   * @param userId User 식별자
   */
  @SubscribeMessage("login")
  handleSubscribeNotifications(
    @ConnectedSocket() socket: Socket,
    @MessageBody() userId: string
  ) {
    // 사용자가 알림을 구독하는 로직
    // 예: 사용자 ID를 이용하여 해당 사용자에게 연결된 알림을 구독
    // 필요한 로직을 추가하세요.
    // 예: this.notifications.filter(notification => notification.userId === userId)
    //     .forEach(notification => socket.emit('notification', notification));

    // 알림을 구독했다는 이벤트를 클라이언트에게 전송
    this.clients.set(socket.id, userId);
    socket.emit("subscribed", "알림 구독 완료");
  }

  // TODO: 알림 받을 데이터들을 소켓을 통해서 받을지 혹은 REST API를 통해서 전달해줄지 검토 필요
  /**
   * @brief 알림 데이터 축적
   *
   * @param socket          User의 socket 인스턴스
   * @param notification
   */
  handleSendNotification(
    @ConnectedSocket() socket: Socket,
    @MessageBody() notification: Notification
  ) {
    // 알림을 받은 로직
    // 예: 받은 알림을 저장하거나 처리하는 로직을 추가하세요.
    // 예: this.notifications.push(notification);

    // 알림을 받았다는 이벤트를 클라이언트에게 전송
    socket.emit("notificationReceived", notification);
  }

  // 다른 필요한 알림 관련 메소드들을 추가하세요.
}
