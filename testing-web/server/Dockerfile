FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy source code
COPY . .

# Expose the port the app runs on
EXPOSE 3002

# Define the command to run the app
CMD ["node", "src/index.js"]
