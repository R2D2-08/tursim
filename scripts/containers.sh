#!/bin/bash

echo "Spawning containers..."

cp ${PWD}/backend/env.example ${PWD}/backend/.env
cp ${PWD}/frontend/env.example ${PWD}/frontend/.env

docker-compose up --build -d

echo "Setup complete. Access Grafana on port 3000. The web-app should be accesible on the server's IP."
