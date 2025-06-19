# Turing Machine Simulator & Code Runner

A containerized web application that allows users to visually simulate custom Turing machines and run Python code (using the `turmachpy` package) in a secure and self-hosted environment. This system was built with a microservices architecture using Docker, and includes monitoring and security best practices.

---

## Features

- **Visual Turing Machine Simulator:** Create, edit, and run custom Turing machines with an easy to use interface.
- **Python Code Runner:** Execute Python code relevant to Turing machines (provided by turmachpy) on the server.
- **User Authentication:** Secure signup, login, and profile management.
- **Microservices Architecture:** Isolated backend, frontend, database, and code execution environments.
- **Reverse Proxy:** Nginx is used as a reverse proxy, exposing only itself to the incoming traffic.
- **Monitoring:** Integrated the architecture with Prometheus and Grafana for metrics' visualization.
- **Security:** UFW firewall configuration and container isolation.

---

## Repository Structure

```
.
├── backend/         # Django REST API for users, machines, and authentication
│   ├── users/           # User management and authentication
│   ├── machines/        # Turing machine models and logic
│   ├── coderunner/      # Procy for the code execution microservice
│   └── ... 
├── frontend/        # React frontend for the UI
│   ├── src/
│   │   ├── pages/        # Main app pages (Login, Signup, Dashboard, Editor, etc.)
│   │   ├── components/   # Reusable UI components (Layout and ProtectedRoute)
│   │   └── services/     # API service layer
│   └── ...
├── nginx/           # Nginx reverse proxy configuration
├── prometheus/      # Prometheus monitoring configuration
├── grafana/         # Grafana dashboards and provisioning
├── docker-compose.yml # Orchestration for all services
├── main.sh          # Server setup and container orchestration script
└── README.md
```

---

## Getting Started

### Prerequisites

- Docker & Docker Compose

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/R2D2-08/tursim.git
   cd tursim
   ```

2. **Copy environment files and configure as needed:**
   ```bash
   cp backend/env.example backend/.env
   cp frontend/env.example frontend/.env
   # Edit the .env files relevantly to set the secrets and database credentials.
   ```

3. **Start all the services:**
   ```bash
   docker-compose up --build
   ```

4. **Access the app:**
   - Frontend: [http://localhost](http://localhost)
   - Grafana: [http://localhost:3000](http://localhost:3000)

---

## Setting up a server from scratch

I've included a ```main.sh``` script to set up a firewall and configure the server for proper deployment of the web-app. To replicate this set-up (Ensure you've got root access):

1. **Clone the repository:**
   ```bash
   git clone https://github.com/R2D2-08/tursim.git
   cd tursim
   ```
2. **Make the script executable:**
   ```bash
   chmod 744 main.sh
   ```
3. **Run the Script:**
   ```bash
   ./main.sh
   ```
   
---
## Components

### Backend (`backend/`)
- **Django REST Framework** for API endpoints.
- **users/**: Handles user registration, login, JWT authentication, and profile.
- **machines/**: CRUD logic for Turing machines.
- **coderunner/**: Securely executes Python code using the `turmachpy` package by proxying requests to a local server.

### Frontend (`frontend/`)
- **React + TypeScript**.
- **Pages**: Login, Signup, Dashboard, Profile, Code Editor, Machine Editor, Documentation.
- **API Layer**: Handles communication with the backend.

### Infrastructure
- **nginx/**: Reverse proxy for secure routing.
- **prometheus/** & **grafana/**: Monitoring and visualization.
- **main.sh**: Server setup, firewall, and container orchestration on a server, initializing everything from scratch.

---

## Security & Deployment

- Only the Nginx container is exposed to the internet.
- UFW firewall restricts access to necessary ports.
- All sensitive credentials are managed via environment variables.
- Containers are isolated in a Docker network.
