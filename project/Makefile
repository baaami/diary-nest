# 디렉토리 설정
API_SERVICE_DOCKER_FILE = ../api-service
BROKER_BINARY=brokerApp
LISTENER_BINARY=listenerApp
DOCKER_COMPOSE_FILE = docker-compose.yml

# 기본 명령어
.PHONY: up_build

## up: starts all containers in the background without forcing build
up:
	@echo "Starting Docker images..."
	docker-compose up -d
	@echo "Docker images started!"

# Docker 이미지 빌드 및 docker-compose 실행
up_build: build_broker build_listener build_api
	@echo "Stopping docker images (if running...)"
	docker-compose down
	@echo "Starting Docker Compose..."
	@docker-compose -f $(DOCKER_COMPOSE_FILE) up -d --build

# Docker 이미지 빌드 및 docker-compose 실행
up_api_only: build_api
	@echo "Stopping api-service container..."
	docker-compose stop api-service
	@echo "Removing api-service container..."
	docker-compose rm -f api-service
	@echo "Starting Docker Compose..."
	docker-compose up -d --no-deps --build api-service

only_build: build_broker build_listener build_api
	@echo "Only Build Docker Image..."
	docker-compose -f $(DOCKER_COMPOSE_FILE) build


## down: stop docker compose
down:
	@echo "Stopping docker compose..."
	docker-compose down
	@echo "Done!"

build_api:
	@echo "Building docker image for nestjs-app..."
	@docker build -t api-service $(API_SERVICE_DOCKER_FILE)
	@echo "Done!"

build_broker:
	@echo "Building broker binary..."
	cd ../broker-service && env GOOS=linux CGO_ENABLED=0 go build -o ${BROKER_BINARY} ./cmd/api
	@echo "Done!"

build_listener:
	@echo "Building listener binary..."
	cd ../listener-service && env GOOS=linux CGO_ENABLED=0 go build -o ${LISTENER_BINARY} .
	@echo "Done!"
