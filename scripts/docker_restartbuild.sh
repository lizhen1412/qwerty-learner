#!/bin/bash

echo "🚀 开始重新构建和部署 Qwerty Learner..."

# 停止并删除现有容器
echo "📦 停止现有容器..."
docker-compose down

# 删除现有镜像（强制重新构建）
echo "🗑️  删除现有镜像..."
docker rmi $(docker images -q qwerty-learner_qwertylearner) 2>/dev/null || true

# 重新构建镜像
echo "🔨 重新构建镜像..."
docker-compose build --no-cache

# 启动服务
echo "🚀 启动服务..."
docker-compose up -d

# 检查服务状态
echo "📊 检查服务状态..."
docker-compose ps

echo "✅ 部署完成！"
echo "🌐 访问地址: http://localhost:8990"
echo "📝 查看日志: docker-compose logs -f"