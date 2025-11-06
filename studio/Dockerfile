
# Use the official Node.js 20 image.
FROM node:20-alpine

# Set the working directory in the container.
WORKDIR /app

# Copy package.json and package-lock.json.
COPY package.json package-lock.json* ./

# Install dependencies.
RUN npm install --legacy-peer-deps

# Copy the rest of the application's source code.
COPY . .

# Set build-time arguments as environment variables
ARG AWS_REGION
ARG S3_BUCKET_NAME
ENV AWS_REGION=${AWS_REGION}
ENV S3_BUCKET_NAME=${S3_BUCKET_NAME}
ENV JWT_SECRET_KEY=${JWT_SECRET_KEY}
ENV GOOGLE_API_KEY=${GOOGLE_API_KEY}

# Build the Next.js application.
RUN npm run build

# Set the port the container will listen on.
EXPOSE 9002

# Set the user to run the app.
USER node

# The command to run the application.
CMD ["node", "server.js"]
