# Use the official Node.js 20 image.
FROM node:20-alpine

# Create and change to the app directory.
WORKDIR /app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this first prevents re-running npm install on every code change.
COPY package*.json ./

# Install production dependencies.
RUN npm install --legacy-peer-deps

# Copy local folders to the container image.
COPY . .

# Build the Next.js app.
RUN npm run build

# Set the correct user to run the app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Expose the port the app runs on
EXPOSE 3000

# Set the correct CMD for standalone output
# The server is started from the standalone directory
CMD ["node", ".next/standalone/server.js"]
