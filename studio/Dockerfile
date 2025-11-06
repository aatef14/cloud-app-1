# Dockerfile

# 1. Base Stage: Setup user and group for security
FROM node:20-alpine AS base
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 2. Dependencies Stage: Install production dependencies
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# 3. Builder Stage: Build the Next.js application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 4. Runner Stage: Create the final, small production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy the standalone server output
COPY --from=builder /app/.next/standalone ./

# Copy the public and static folders from the builder stage
# These are located at the root of the builder's context, not inside .next/standalone
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 9002

ENV PORT=9002

# Run the Next.js server
CMD ["node", "server.js"]
