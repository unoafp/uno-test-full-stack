FROM node:24-alpine AS base

# -------- Build Stage --------
FROM base AS builder
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
    else echo "Lockfile not found." && exit 1; \
    fi

# Copy all application code
COPY . .

# Build and remove dev dependencies to keep the final image small
RUN npm run build  \
    && npm prune --omit=dev

# -------- Production Stage --------
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Use a dedicated, non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Copy only necessary files from the builder stage
COPY --from=builder --chown=node:nestjs:nodejs /app/package*.json ./
COPY --from=builder --chown=node:nestjs:nodejs /app/node_modules/ ./node_modules/
COPY --from=builder --chown=node:nestjs:nodejs /app/dist/ ./dist/

USER nestjs

# Expose the port the app runs on (default is 3001 for NestJS)
EXPOSE 3001

# Command to run the production application
CMD ["node", "dist/main.js"]
