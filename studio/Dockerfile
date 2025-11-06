# Stage 1: Dependencies - Install dependencies in a separate stage for caching
FROM node:20-slim AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# Stage 2: Builder - Build the Next.js application
FROM node:20-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Pass build-time arguments
ARG AWS_REGION
ARG S3_BUCKET_NAME

# Expose build-time arguments as environment variables for the build process
ENV AWS_REGION=${AWS_REGION}
ENV S3_BUCKET_NAME=${S3_BUCKET_NAME}

# Build the Next.js application
RUN npm run build

# Stage 3: Production/Runner - Create the final lightweight image
FROM node:20-slim AS runner
WORKDIR /app

# Set environment variables for production
ENV NODE_ENV=production
# These will be loaded from the --env-file at runtime
ENV AWS_REGION=${AWS_REGION}
ENV S3_BUCKET_NAME=${S3_BUCKET_NAME}

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the standalone Next.js server output from the builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Correctly copy the public and .next/static folders from within the standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
# The server is started from the server.js file in the standalone output
CMD ["node", "server.js"]
