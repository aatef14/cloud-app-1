# Dockerfile for a Next.js application with standalone output

# Stage 1: Dependency installation
# This stage installs all dependencies, including devDependencies, needed for the build.
FROM node:20-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps


# Stage 2: Code builder
# This stage builds the Next.js application.
FROM node:20-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Accept build arguments for variables needed during the build process.
ARG AWS_REGION
ARG S3_BUCKET_NAME

# Set these as environment variables for the 'next build' command.
ENV AWS_REGION=${AWS_REGION}
ENV S3_BUCKET_NAME=${S3_BUCKET_NAME}

# Build the Next.js application.
RUN npm run build


# Stage 3: Production image
# This stage creates the final, small, production-ready image.
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy production dependencies manifests. This is crucial.
COPY package.json package-lock.json ./

# Install ONLY production dependencies to keep the image small.
# The --omit=dev flag ensures devDependencies are not installed.
RUN npm install --omit=dev --legacy-peer-deps

# Copy the standalone Next.js server files from the builder stage.
COPY --from=builder /app/.next/standalone ./
# Copy the static assets from the builder stage.
COPY --from=builder /app/.next/static ./.next/static

# The server will run on port 3000 inside the container
EXPOSE 3000

# The command to start the server.
CMD ["node", "server.js"]
