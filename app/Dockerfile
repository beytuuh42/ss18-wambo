FROM node:10

RUN mkdir -p /usr/src/app/client
WORKDIR /usr/src/app/client

COPY ./package*.json /usr/src/app/client/
COPY . /usr/src/app/client

RUN npm install ionic --global
RUN npm install

EXPOSE 8100

CMD ["ionic", "serve"]
