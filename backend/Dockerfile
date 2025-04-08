# Use an official Node.js runtime as a parent image (Choose a version, e.g., 18 or 20)
# Using Debian-based image as it has apt package manager
FROM node:18-bookworm-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Install system dependencies including assimp-utils (which provides the 'assimp' command)
# Update package lists, install dependencies, and clean up apt cache
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    assimp-utils \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json (or yarn.lock)
# Use wildcard to copy both if either exists
COPY package*.json ./

# Install app dependencies
# Use npm ci for cleaner installs in CI/CD environments if package-lock.json is committed and up-to-date
# Otherwise, npm install is fine.
RUN npm install

# Bundle app source inside Docker image
COPY . .

# Make port 3001 available to the world outside this container
# Render will automatically map this to 80/443 externally if needed,
# and provide the PORT environment variable. Our app reads process.env.PORT.
EXPOSE 3001

# Define the command to run your app using CMD which defines your runtime
CMD [ "node", "index.js" ]
# Alternatively, if you use npm start: CMD [ "npm", "start" ]
