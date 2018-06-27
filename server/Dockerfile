FROM node:alpine

RUN mkdir -p /usr/src/app/server
WORKDIR /usr/src/app/server

COPY ./package.json /usr/src/app/server/
RUN npm install npm@5.3.0
COPY . /usr/src/app/server

EXPOSE 3000

CMD ["npm", "start"]
