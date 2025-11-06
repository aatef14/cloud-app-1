# 1. Base Stage: Use a specific Node.js version and set up a non-root user for security.
FROM node:20-alpine AS base
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 2. Dependencies Stage: Install only the necessary production dependencies.
# This leverages Docker's layer caching to speed up future builds.
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps --production

# 3. Builder Stage: Build the Next.js application.
# It copies source code and builds the app, creating the .next directory.
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# This environment variable is necessary for Next.js to enable standalone output mode.
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# 4. Runner Stage: Create the final, small, production-ready image.
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

# Copy the user/group setup from the base stage.
COPY --from=builder /etc/passwd /etc/passwd
COPY --from=builder /etc/group /etc/group

# Copy only the necessary files for a standalone Next.js app.
# These are copied from the 'builder' stage, which has the complete build output.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Set the user to the non-root user for better security.
USER nextjs

EXPOSE 9002

# Set the correct PORT for the Next.js server.
ENV PORT 9002

# The command to start the Next.js server in standalone mode.
CMD ["node", "server.js"]
