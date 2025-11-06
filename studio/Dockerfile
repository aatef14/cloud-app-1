# 1. Dependencies Stage: Install dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# 2. Builder Stage: Build the application
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Pass build arguments as environment variables
ARG AWS_REGION
ARG S3_BUCKET_NAME
ENV AWS_REGION=${AWS_REGION}
ENV S3_BUCKET_NAME=${S3_BUCKET_NAME}

RUN npm run build

# 3. Production Stage: Create the final lightweight image
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case of trouble running production builds.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the standalone Next.js server output
COPY --from=builder /app/.next/standalone ./
# Copy the public and static folders
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
# Pass runtime environment variables
ENV AWS_REGION=${AWS_REGION}
ENV S3_BUCKET_NAME=${S3_BUCKET_NAME}

# server.js is the entrypoint from the standalone build
CMD ["node", "server.js"]
