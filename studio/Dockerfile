# Dockerfile for a Next.js application

# Stage 1: Base image for installing dependencies
FROM node:20-slim AS deps
WORKDIR /app

# Copy package.json and lock file and install dependencies
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# Stage 2: Builder stage for creating the production build
FROM node:20-slim AS builder
WORKDIR /app

# Copy dependencies from the previous stage
COPY --from=deps /app/node_modules ./node_modules
# Copy the rest of the application code
COPY . .

# Set build-time arguments (will be provided by the build command)
ARG AWS_REGION
ARG S3_BUCKET_NAME
ENV AWS_REGION=${AWS_REGION}
ENV S3_BUCKET_NAME=${S3_BUCKET_NAME}

# Build the Next.js application
RUN npm run build

# Stage 3: Production image - lightweight and optimized
FROM node:20-slim AS runner
WORKDIR /app

# Set the environment to production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

# Copy the minimal standalone output from the builder stage
COPY --from=builder /app/.next/standalone ./
# Copy the static assets
COPY --from=builder /app/.next/static ./.next/static

# The server will run on port 3000 inside the container
EXPOSE 3000

# Command to start the application
CMD ["node", "server.js"]
