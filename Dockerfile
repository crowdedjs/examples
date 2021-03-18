FROM node:12.8.1
WORKDIR /app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# Bundle app source
# COPY ./index.js .
# COPY ./dist .
RUN mkdir other
# COPY ./other/dist ./other 

COPY package*.json ./

# If you are building your code for production
# RUN npm ci --only=production
COPY dist ./other/dist
COPY /code/dist ./dist
COPY /code/index.js ./
RUN npm install



ENTRYPOINT [ "node", "index.js"]