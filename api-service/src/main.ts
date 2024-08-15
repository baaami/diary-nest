import { ValidationPipe, WebSocketAdapter } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { WsAdapter } from "@nestjs/platform-ws";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

class SocketIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    const server = super.createIOServer(port, options);
    server.use((socket: any, next: any) => {
      next();
    });
    // 웹소켓 서버 옵션 설정 등을 추가할 수 있습니다.
    return server;
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // withCredentials: true 옵션을 사용하는 경우, Access-Control-Allow-Origin 헤더는 와일드카드(*)가 아니라 요청을 보내는 도메인이어야 함
  const corsOptions: CorsOptions = {
    origin: ["http://localhost:2719"],
    // credentials: true,
  };

  app.enableCors(corsOptions);

  app.use(cookieParser());

  app.useWebSocketAdapter(new SocketIoAdapter(app));

  app.useGlobalPipes(
    new ValidationPipe({
      // decorator가 없는 어떤 property에 대해서 값이 input되지 못하게함
      // whitelist: true,
      // 존재하지 않는 property를 보낼 경우 체크
      forbidNonWhitelisted: true,
      // user들이 보낸 데이터를 실제 원하는 타입으로 변환해줌
      transform: true,
    })
  );

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
