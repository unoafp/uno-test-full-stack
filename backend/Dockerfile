FROM node:22-slim

USER root
RUN apt-get update && apt-get install -y wget curl procps ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3001

# CMD npx prisma migrate deploy && npm run start:prod
CMD npx prisma db push && npm run start:prod
