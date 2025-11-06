# Stage 1: Install dependencies
FROM node:20-slim AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# Stage 2: Build the application
FROM node:20-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Pass build arguments as environment variables
ARG AWS_REGION
ARG S3_BUCKET_NAME
ENV AWS_REGION=${AWS_REGION}
ENV S3_BUCKET_NAME=${S3_BUCKET_NAME}

# Build the Next.js application
RUN npm run build

# Stage 3: Production image - lightweight and optimized
FROM node:20-slim AS runner
WORKDIR /app

# Create a non-root user for security
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the standalone Next.js server output from the builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

ENV PORT 3000

# Run the Next.js server
# The standalone server is now located in the root directory
CMD ["node", "server.js"]
