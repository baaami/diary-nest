# Makefile

# 디렉토리 설정
API_SERVICE_DIR = ../api-service
DOCKER_COMPOSE_FILE = docker-compose.yml

# 기본 명령어
.PHONY: up_build

# Docker 이미지 빌드 및 docker-compose 실행
up_build:
	@echo "Building Docker image for nestjs-app..."
	@docker build -t nestjs-app $(API_SERVICE_DIR)
	@echo "Starting Docker Compose..."
	@docker-compose -f $(DOCKER_COMPOSE_FILE) up -d --build

## down: stop docker compose
down:
	@echo "Stopping docker compose..."
	docker-compose down
	@echo "Done!"