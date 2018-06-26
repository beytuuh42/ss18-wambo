FROM node:10

RUN mkdir -p /usr/src/app/server
WORKDIR /usr/src/app/server

COPY ./package*.json /usr/src/app/server/
COPY . /usr/src/app/server

RUN npm install nodemon --global 
RUN npm install

EXPOSE 3000

CMD [ "npm", "start"]
