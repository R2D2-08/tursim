#!/bin/bash
set -e

echo "Starting Build..."

echo "Updating and Installing packages pre-requisites..."
sudo apt-get update
sudo apt-get install -y ufw curl git apt-transport-https ca-certificates software-properties-common

echo "Setting up the UFW firewall..."
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow http
sudo ufw allow https
sudo ufw --force enable

if ! command -v docker &> /dev/null; then
  echo "Installing Docker..."
  curl -fsSL https://get.docker.com -o get-docker.sh
  sh get-docker.sh
  sudo usermod -aG docker "$USER"
  rm get-docker.sh
else
  echo "Docker is already installed..."
fi

if ! command -v docker-compose &> /dev/null; then
  echo "Installing Docker-Compose..."
  DOCKER_COMPOSE_VERSION="2.24.6"
  sudo curl -SL "https://github.com/docker/compose/releases/download/v${DOCKER_COMPOSE_VERSION}/docker-compose-linux-x86_64" -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose
else
  echo "Docker Compose is already installed..."
fi

sudo systemctl start docker
sudo systemctl enable docker

echo "Spawning containers..."

newgrp docker
cp ${PWD}/backend/env.example ${PWD}/backend/.env
cp ${PWD}/frontend/env.example ${PWD}/frontend/.env

docker-compose up --build -d

echo "Setup complete. Access Grafana on port 3000. The web-app should be accesible on the server's IP."
