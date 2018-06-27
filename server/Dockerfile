FROM node:10

RUN mkdir -p /usr/src/app/server
WORKDIR /usr/src/app/server
RUN npm install nodemon --global


COPY package*.json /usr/src/app/server/
RUN npm install
COPY . /usr/src/app/server

EXPOSE 3000

CMD [ "npm", "start"]
