# Stage 1: Dependency installation
# This stage installs all dependencies, including devDependencies,
# which might be needed for the build process.
FROM node:20-slim AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# Stage 2: Application builder
# This stage builds the Next.js application.
FROM node:20-slim AS builder
WORKDIR /app
# Copy dependencies from the 'deps' stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set build-time arguments. These are passed in from the 'docker build' command.
ARG AWS_REGION
ARG S3_BUCKET_NAME

# Set environment variables for the build process.
# This makes the ARG values available to 'npm run build'.
ENV AWS_REGION=$AWS_REGION
ENV S3_BUCKET_NAME=$S3_BUCKET_NAME

# Build the Next.js application
RUN npm run build

# Prune devDependencies for a smaller final image
RUN npm prune --omit=dev


# Stage 3: Production image - lightweight and optimized
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy production-ready node_modules from the builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy the standalone Next.js server output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# The server will run on port 3000 inside the container
EXPOSE 3000

# The command to start the application
CMD ["node", "server.js"]
