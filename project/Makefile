# Makefile

# 디렉토리 설정
API_SERVICE_DOCKER_FILE = ../api-service
LISTENER_BINARY=listenerApp
DOCKER_COMPOSE_FILE = docker-compose.yml

# 기본 명령어
.PHONY: up_build

# Docker 이미지 빌드 및 docker-compose 실행
up_build: build_listener build_api
	@echo "Stopping docker images (if running...)"
	docker-compose down
	@echo "Starting Docker Compose..."
	@docker-compose -f $(DOCKER_COMPOSE_FILE) up -d --build

## down: stop docker compose
down:
	@echo "Stopping docker compose..."
	docker-compose down
	@echo "Done!"

build_api:
	@echo "Building docker image for nestjs-app..."
	@docker build -t nestjs-app $(API_SERVICE_DOCKER_FILE)
	@echo "Done!"

build_listener:
	@echo "Building listener binary..."
	cd ../listener-service && env GOOS=linux CGO_ENABLED=0 go build -o ${LISTENER_BINARY} .
	@echo "Done!"