# 1. Base Image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and lock files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of your application code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 9002

# Set the command to start the app
CMD ["npm", "start"]
