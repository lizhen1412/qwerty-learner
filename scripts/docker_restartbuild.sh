#!/bin/bash

docker-compose down
docker rmi $(docker images -q qwerty-learner-qwertylearner)
docker-compose up -d

echo "Docker 容器已重启并重新构建"