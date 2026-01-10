# Backend - Memory Game API

## Description

Backend API for the Memory Game built with [NestJS](https://nestjs.com/).

## Prerequisites

- Node.js (v18 or later recommended)
- Docker (for PostgreSQL database)

## Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Adjust the values in `.env` if necessary (e.g., database credentials).

## Installation

```bash
npm install
```

## Running the app

### 1. Start Database
Ensure your PostgreSQL database is running. You can use the `docker-compose.yml` in the root directory (see root README).

## Database Management (Prisma)

### Sync Database Schema
To continuously sync your schema with the database during development:
```bash
npx prisma db push
```

### Apply Migrations
To create and apply migrations for production-like environments:
```bash
npx prisma migrate dev
```

### Generate Client
If you make changes to `prisma.config.ts` or `schema.prisma`, regenerate the client:
```bash
npx prisma generate
```

### Prisma Studio
To view and edit data in your database:
```bash
npx prisma studio
```

### 2. Start Server

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```
