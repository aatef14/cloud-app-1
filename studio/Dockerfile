# Dockerfile for Next.js Application

# ---- Builder Stage ----
# This stage builds the application.
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package configuration files
COPY package.json ./
COPY package-lock.json ./
COPY .npmrc ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Set environment to production for the build
ENV NODE_ENV=production

# Build the Next.js application
RUN npm run build

# ---- Runner Stage ----
# This stage runs the built application.
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy the built application from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose the port the app runs on (Next.js default is 3000)
EXPOSE 3000

# The command to start the application
CMD ["npm", "start"]
