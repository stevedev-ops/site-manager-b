FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy Prisma files
COPY prisma ./prisma
RUN npx prisma generate

# Copy built application
COPY --from=build /app/dist ./dist

# Create storage directory
RUN mkdir -p /app/storage

# Expose port
EXPOSE 5000

# Start server
CMD ["npm", "start"]
