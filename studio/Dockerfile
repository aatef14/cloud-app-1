# --- Base Stage for Node.js ---
# Use a specific Node.js version for consistency
FROM node:20-slim AS base

# Set working directory
WORKDIR /app

# --- Dependencies Stage ---
# This stage is dedicated to installing npm dependencies
FROM base AS deps
WORKDIR /app

# Copy package.json and lock file
COPY package.json package-lock.json* ./

# Install dependencies. Using --legacy-peer-deps for compatibility.
RUN npm install --legacy-peer-deps


# --- Build Stage ---
# This stage builds the Next.js application
FROM base AS builder
WORKDIR /app

# Copy dependencies from the 'deps' stage
COPY --from=deps /app/node_modules ./node_modules
# Copy the rest of the application source code
COPY . .

# Environment variables for the build process
# These are passed in as build arguments
ARG AWS_REGION
ARG S3_BUCKET_NAME

ENV AWS_REGION=${AWS_REGION}
ENV S3_BUCKET_NAME=${S3_BUCKET_NAME}

# Build the Next.js application
RUN npm run build


# --- Runner Stage ---
# This is the final, small, production-ready image
FROM base AS runner
WORKDIR /app

# Set environment variables for production
ENV NODE_ENV=production
# Undo the build-time env vars
ENV AWS_REGION=
ENV S3_BUCKET_NAME=

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the standalone Next.js server output from the builder stage
COPY --from=builder /app/.next/standalone ./

# Correctly copy the public and .next/static folders from the builder stage
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Set the user to the non-root user
USER nextjs

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "server.js"]
