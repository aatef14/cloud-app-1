# Stage 1: Base image with dependencies
# Use a specific Node.js version for consistency
FROM node:20.11.1-alpine AS base
WORKDIR /app

# Install necessary packages for building native modules
RUN apk add --no-cache libc6-compat python3 make g++

# Copy package.json and package-lock.json
COPY package*.json ./

# Stage 2: Build the application
FROM base AS builder
WORKDIR /app

# Install all dependencies (including devDependencies)
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Add build arguments for environment variables needed at build time
ARG AWS_REGION
ARG S3_BUCKET_NAME

# Set the environment variables for the build process
ENV AWS_REGION=${AWS_REGION}
ENV S3_BUCKET_NAME=${S3_BUCKET_NAME}

# Build the Next.js application
RUN npm run build

# Stage 3: Production image
# Use a slim, secure base image
FROM node:20.11.1-alpine AS runner
WORKDIR /app

# You don't need the full node_modules in production, only what's necessary
# The standalone output mode handles this for us.
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# The server will run on port 3000 inside the container
EXPOSE 3000

# The command to start the application
CMD ["node", "server.js"]
