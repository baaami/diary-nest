
# 거래 전용 애플리케이션 API

[![License](https://img.shields.io/github/license/saluki/nestjs-template.svg)](https://github.com/saluki/nestjs-template/blob/master/LICENSE)

사용 Protocol

- REST API with [TypeORM](http://typeorm.io) 지원
- Socket I.O를 통한 채팅, 알림 기능 지원

지원 API

REST API

- 상품 읽기/등록/수정/삭제
- 상품 리스트 제공 (카테고리, 날짜)
- 회원 가입 (SNS, LOCAL)
- 회원 정보 제공
- 검색 기능 제공 (상품 제목, 글 텍스트 매칭)
- 관심 목록 읽기/등록
- 리뷰 읽기/등록

Socket.IO

- 채팅
- 알림

## 1. Getting started

### 1.1 Requirements

MySQL 데이터베이스 준비
- Default: localhost 내 3306 포트로 사용 가능

### 1.2 Project configuration

프로젝트 Clone

``` sh
git clone [https://github.com/saluki/nestjs-template my-project](https://github.com/baaami/school_market.git)
```

프로젝트의 종속 라이브러리 설치

```sh
cd ./school_market
yarn install // or npm install
```

아래 환경 변수 설명란을 참고하여 .env 파일 작성

```
cp .env.example .env
vi .env
```

환경 변수 설정

    // .env File
    
    // JWT 토큰 방식에 사용할 KEY
    JWT_SECRET_KEY="${ANYTHING}"

    DB_USERNAME="{MYSQL_USERNAME]"
    DB_PASSWORD="{MYSQL_PASSWORD}"
    // MYSQL SERVER 설치 후 사용할 DATABASE 생성, 해당 DATABASE 기입
    DB_DATABASE="{MYSQL_DATABASE}"

    // SNS 로그인 사용 시 KAKAO DEVELOPER 페이지 내 프로젝트 등록 후 기입
    KAKAO_ID="{KAKAO_ID}"
    KAKAO_CALLBACK_URL="{KAKAO CALLBACK URL}"

### 1.3 Launch and discover

프로젝트 DEV 모드 실행

```sh
# Launch the development server with TSNode
npm run dev
```

### 1.4 Create Faker Data

상품 설명에 포함될 가짜 이미지 다운로드

```sh
# image*는 약 100개 이상의 이미지 파일들을 의미
cp image* ${PROJECT_ROOT_PATH}/upload
```

가짜 데이터 생성
```sh
yarn faker
```

## 2. Project structure

This template was made with a well-defined directory structure.

```sh
src/
├── api
│   ├── auth
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.spec.ts
│   │   ├── auth.service.ts
│   │   ├── auth.shared.service.ts
│   │   ├── constant.ts
│   │   └── dto
│   │       └── create-auth.dto.ts
│   ├── content
│   │   ├── content.controller.ts
│   │   ├── content.module.ts
│   │   ├── content.service.spec.ts
│   │   ├── content.service.ts
│   │   ├── dto
│   │   │   ├── create-content.dto.ts
│   │   │   └── update-content.dto.ts
│   │   └── entities
│   │       └── content.entity.ts
│   ├── fakerdata
│   │   ├── insert.common.types.ts
│   │   ├── insert.content.service.spec.ts
│   │   ├── insert.favorite.service.spec.ts
│   │   ├── insert.review.service.spec.ts
│   │   └── insert.user.service.spec.ts
│   ├── favorite
│   │   ├── favorite.controller.ts
│   │   ├── favorite.module.ts
│   │   ├── favorite.service.spec.ts
│   │   └── favorite.service.ts
│   ├── review
│   │   ├── dto
│   │   │   ├── create-review.dto.ts
│   │   │   └── update-review.dto.ts
│   │   ├── entities
│   │   │   └── review.entity.ts
│   │   ├── review.controller.spec.ts
│   │   ├── review.controller.ts
│   │   ├── review.module.ts
│   │   ├── review.service.spec.ts
│   │   └── review.service.ts
│   ├── room
│   │   ├── room.controller.ts
│   │   ├── room.module.ts
│   │   └── rooms.service.ts
│   └── user
│       ├── dto
│       │   ├── create-user.dto.ts
│       │   ├── update-profile.dto.ts
│       │   └── update-user.dto.ts
│       ├── entities
│       │   └── user.entity.ts
│       ├── user.controller.ts
│       ├── user.module.ts
│       ├── user.service.spec.ts
│       └── user.service.ts
├── app.module.ts
├── common
│   ├── define.ts
│   ├── dto
│   │   ├── create-product-image.dto.ts
│   │   ├── create-profile-image.dto.ts
│   │   └── update-product-image.dto.ts
│   ├── entities
│   │   ├── common.entity.ts
│   │   ├── define.entity.ts
│   │   ├── favorite.entity.ts
│   │   ├── productimage.entity.ts
│   │   └── profileimage.entity.ts
│   ├── guard
│   │   └── auth.guard.ts
│   └── util.ts
├── events
│   ├── chat
│   │   ├── chat.controller.ts
│   │   ├── chat.service.ts
│   │   ├── chats.gateway.ts
│   │   ├── dto
│   │   │   ├── create-chat.dto.ts
│   │   │   └── create-room.dto.ts
│   │   └── entities
│   │       ├── chat.entity.ts
│   │       └── room.entity.ts
│   ├── events.module.ts
│   └── push
│       └── push.gateway.ts
├── lib
│   └── multer
│       └── multerOption.ts
├── main.ts
├── middleware
│   └── jwt.middleware.ts
└── sql
    ├── contents.sql
    ├── favorites.sql
    ├── initialize.sql
    └── reviews.sql
```
## 3. Project goals

작성 예정

## 4. Contributing

Feel free to suggest an improvement, report a bug, or ask something: [https://github.com/saluki/nestjs-template/issues](https://github.com/saluki/nestjs-template/issues)
