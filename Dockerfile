# Multi-stage build for production

# Stage 1: Build client
FROM node:18-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci --only=production
COPY client/ ./
RUN npm run build

# Stage 2: Setup server
FROM node:18-alpine AS server-build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY server/ ./server/
COPY .env.production ./.env

# Stage 3: Production image
FROM node:18-alpine
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy server files
COPY --from=server-build --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=server-build --chown=nodejs:nodejs /app/server ./server
COPY --from=server-build --chown=nodejs:nodejs /app/package*.json ./

# Copy client build
COPY --from=client-build --chown=nodejs:nodejs /app/client/build ./client/build

# Create logs directory
RUN mkdir -p /app/logs && chown -R nodejs:nodejs /app/logs

# Create uploads directory
RUN mkdir -p /app/uploads && chown -R nodejs:nodejs /app/uploads

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["node", "server/server.js"]

# Made with Bob
