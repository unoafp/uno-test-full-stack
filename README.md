# Memory Game - Full Stack Project

This repository contains the full stack implementation of a Memory Game, consisting of a NestJS backend and a Next.js frontend, backed by a PostgreSQL database.

## Project Structure

- `backend/`: NestJS API application.
- `frontend/`: Next.js User Interface.
- `docker-compose.yml`: Docker configuration for the PostgreSQL database.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Docker](https://www.docker.com/) & Docker Compose

## Global Setup

### 1. Environment Configuration

Copy the example environment file in the root directory:

```bash
cp .env.example .env
```

This file contains the database credentials shareable between docker usage and backend connection.

### 2. Start Database

Start the PostgreSQL database using Docker Compose:

```bash
docker-compose up -d db
```

Check if the database is running:
```bash
docker ps
```

### 3. Setup Backend

Navigate to the `backend` directory and follow the instructions:

```bash
cd backend
# Install dependencies
npm install
# Setup env (if not already done or specific to backend)
cp .env.example .env
# Start the server
npm run start:dev
```

The backend API will be available at `http://localhost:3000` (by default).

### 4. Setup Frontend

Navigate to the `frontend` directory (in a new terminal):

```bash
cd frontend
# Install dependencies
npm install
# Setup env
cp .env.example .env.local
# Start the development server
npm run dev
```

The frontend UI will be available at `http://localhost:3000` (Note: If backend is also 3000, one might fail or pick a different port. Next.js usually picks 3001 if 3000 is busy, or you might need to configure ports).

> **Note**: Standard NestJS runs on 3000. Next.js also runs on 3000 by default.
> It is recommended to run the **Backend** on one port (e.g. 3000) and **Frontend** on another (e.g. 3001).
> Next.js will ask to use a different port if 3000 is occupied.

## Testing

Refer to the individual `README.md` files in `backend/` and `frontend/` for running tests.

## Troubleshooting

- **Database Connection Error**: Ensure the docker container is running and the credentials in `.env` match.
- **Port Conflict**: If both apps try to use port 3000, one will fail or switch ports. Watch the terminal output.
