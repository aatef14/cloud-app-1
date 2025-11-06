# Stage 1: Dependency installation
# This stage installs all dependencies, including devDependencies,
# which are needed for the build process.
FROM node:20-slim AS deps
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Stage 2: Code builder
# This stage builds the Next.js application.
FROM node:20-slim AS builder
WORKDIR /app

# Copy installed dependencies from the 'deps' stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Arguments to pass environment variables needed at build time
ARG AWS_REGION
ARG S3_BUCKET_NAME

# Set the environment variables for the build command
ENV AWS_REGION=${AWS_REGION}
ENV S3_BUCKET_NAME=${S3_BUCKET_NAME}

# Since you are using an IAM role on EC2, you don't need to pass build-time AWS secrets.
# We will rely on runtime environment variables.
RUN npm run build

# Stage 3: Production image
# This stage creates the final, small, and optimized image for production.
FROM node:20-slim AS runner
WORKDIR /app

# Set the environment to production
ENV NODE_ENV=production
# The --omit=dev flag ensures devDependencies are not installed
RUN npm install --omit=dev --legacy-peer-deps


# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# The server will run on port 3000 inside the container
EXPOSE 3000

# The command to start the application
CMD ["node", "server.js"]
