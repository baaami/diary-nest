import { ValidationPipe, WebSocketAdapter } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { WsAdapter } from "@nestjs/platform-ws";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // withCredentials: true 옵션을 사용하는 경우, Access-Control-Allow-Origin 헤더는 와일드카드(*)가 아니라 요청을 보내는 도메인이어야 함
  app.enableCors({
    origin: "http://localhost:3000", // 수정 필요
    credentials: true, // withCredentials 옵션 사용시 필수
  });
  app.use(cookieParser());
  // somewhere in your initialization file
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
  app.useWebSocketAdapter(new WsAdapter(app));

  await app.listen(4000);
}
bootstrap();
