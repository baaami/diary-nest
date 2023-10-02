import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Socket } from "socket.io";
interface Notification {
    notificationId: string;
    userId: number;
    message: string;
}
export declare class PushGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private logger;
    private notifications;
    private clients;
    afterInit(): void;
    handleConnection(socket: Socket): void;
    handleDisconnect(socket: Socket): void;
    handleSubscribeNotifications(socket: Socket, userId: string): void;
    handleSendNotification(socket: Socket, notification: Notification): void;
}
export {};
