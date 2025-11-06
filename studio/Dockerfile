# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# Stage 2: Build the application
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Since you are using an IAM role on EC2, you don't need to pass build-time AWS secrets.
# We will rely on runtime environment variables.
RUN npm run build

# Stage 3: Production image
# This creates a smaller, more secure final image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the line below if you want to disable telemetry
# ENV NEXT_TELEMETRY_DISABLED 1

# Copy only the necessary files for running the app
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copy the standalone Next.js server output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Set the correct user for running the app
USER nextjs

EXPOSE 3000

ENV PORT=3000

# Run the app
CMD ["node", "server.js"]
