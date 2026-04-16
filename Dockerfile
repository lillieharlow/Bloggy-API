# syntax=docker/dockerfile:1

# Use node.js 24 Alpine image for production environment
FROM node:24-alpine

# Set working directory inside the container
WORKDIR /app

# Only install required production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the rest of the application code
COPY . .

# Expose API port the app runs on (inside container)
EXPOSE 5000

# Start the application
CMD ["npm", "start"]