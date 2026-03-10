# ScoutOS Live Dockerfile for Next.js
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build
RUN npm run build

# Production image
FROM node:20-alpine AS runner

WORKDIR /app

# Set to production
ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Set ownership
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER 1001

# Expose port (will be overridden by PORT env var)
EXPOSE 3000

# Set HOSTNAME for Next.js standalone (required for Docker)
ENV HOSTNAME="0.0.0.0"

# Start server - Next.js standalone respects PORT env var
CMD ["node", "server.js"]