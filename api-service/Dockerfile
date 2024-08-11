# 베이스 이미지 설정 (Node.js LTS 버전 사용)
FROM node:20.9

# 애플리케이션 작업 디렉토리 생성
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN yarn install

# 소스 코드 복사
COPY . .

# 애플리케이션 포트 설정
EXPOSE 3000

# 애플리케이션 실행 명령어
CMD ["yarn", "dev"]
