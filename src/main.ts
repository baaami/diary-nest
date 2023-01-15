import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
			// decorator가 없는 어떤 property에 대해서 값이 input되지 못하게함
      // whitelist: true,
			// 존재하지 않는 property를 보낼 경우 체크
      forbidNonWhitelisted: true,
			// user들이 보낸 데이터를 실제 원하는 타입으로 변환해줌
      transform: true,
    }),
  );
  await app.listen(4000);
}
bootstrap();
