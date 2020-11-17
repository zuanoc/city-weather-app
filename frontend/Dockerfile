# Use a lighter version of Node as a parent image
FROM mhart/alpine-node:14.15.0
# Set the working directory to /client
WORKDIR /app
# copy package.json into the container at /client
COPY package*.json /app/
# install dependencies
RUN yarn install
# Copy the current directory contents into the container at /client
COPY . /app/
# Make port 3000 available to the world outside this container
EXPOSE 3000
# Run the app when the container launches
CMD ["yarn", "start"]
