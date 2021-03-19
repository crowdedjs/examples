FROM node:12.8.1
WORKDIR /app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# Bundle app source
# COPY ./index.js .
# COPY ./dist .
RUN mkdir other
RUN mkdir /code
RUN mkdir dist
RUN apt-get update && \
    apt-get install -y \
        python3 \
        python3-pip \
        python3-setuptools \
        groff \
        less \
    && pip3 install --upgrade pip \
    && apt-get clean

RUN pip3 --no-cache-dir install --upgrade awscli

ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG AWS_DEFAULT_REGION

ENV AWS_ACCESS_KEY_ID $AWS_ACCESS_KEY_ID
ENV AWS_SECRET_ACCESS_KEY $AWS_SECRET_ACCESS_KEY
ENV AWS_DEFAULT_REGION $AWS_DEFAULT_REGION


RUN aws s3 sync s3://vueproject-simulation/dist/ /code/
# COPY ./other/dist ./other 

COPY package*.json ./

# If you are building your code for production
# RUN npm ci --only=production
COPY dist ./other/dist
RUN cwd
COPY /code/dist ./dist
COPY /code/index.js ./
RUN npm install


ENTRYPOINT [ "node", "index.js"]