# 1. Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# 2. Build the application
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set dummy env vars for build time to prevent errors
ENV AWS_REGION=dummy-region
ENV S3_BUCKET_NAME=dummy-bucket
ENV JWT_SECRET_KEY=dummy-secret
ENV GOOGLE_API_KEY=dummy-key

RUN npm run build

# 3. Production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the standalone Next.js server output
COPY --from=builder /app/.next/standalone ./
# Copy the public and static folders
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 9002

ENV PORT 9002
# All ENV vars like AWS_REGION, S3_BUCKET_NAME, etc., must be passed at runtime
# For example: docker run -p 9002:9002 -e AWS_REGION=... -e S3_BUCKET_NAME=... <image_name>

CMD ["node", "server.js"]
