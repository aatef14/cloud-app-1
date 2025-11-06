# Stage 1: Dependencies - Install npm packages
FROM node:20-slim AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# Stage 2: Builder - Build the Next.js application
FROM node:20-slim AS builder
WORKDIR /app

# Copy dependencies from the 'deps' stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Pass build-time arguments as environment variables
ARG AWS_REGION
ARG S3_BUCKET_NAME
ENV AWS_REGION=${AWS_REGION}
ENV S3_BUCKET_NAME=${S3_BUCKET_NAME}

# Build the Next.js application
RUN npm run build

# Stage 3: Production image - lightweight and optimized
FROM node:20-slim AS runner
WORKDIR /app

# Set environment variables for production
ENV NODE_ENV=production

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the standalone Next.js server output from the builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Correctly copy the public folder from its location within the standalone output
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 9002
ENV PORT 9002
ENV HOSTNAME "0.0.0.0"

# Run the Next.js server
CMD ["node", "server.js"]
