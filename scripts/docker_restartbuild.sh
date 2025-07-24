#!/bin/bash

docker-compose down
docker rmi $(docker images -q qwertylearner)
docker-compose up -d

echo "Docker 容器已重启并重新构建"