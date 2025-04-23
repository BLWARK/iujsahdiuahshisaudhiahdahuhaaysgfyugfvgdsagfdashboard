# Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy source files
COPY . .

# Build command can be adjusted depending on dev or prod
# For dev: docker-compose handles "npm run dev"
# For prod:
# RUN npm run build
# CMD ["npm", "start"]