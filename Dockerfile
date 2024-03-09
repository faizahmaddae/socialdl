# Specify the base image from the official Node.js 16 slim version
FROM node:16-slim

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install app dependencies
RUN npm install --only=production

# Bundle app source inside the Docker image
COPY . .

# Your app binds to port 8080 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 8080

# Define the command to run your app using CMD which defines your runtime
CMD [ "node", "app.js" ]
