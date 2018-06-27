FROM node:10

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
COPY package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /usr/src/app/server && cp -a /tmp/node_modules /usr/src/app/server

# From here we load our application's code in, therefore the previous docker
# "layer" thats been cached will be used if possible
WORKDIR /usr/src/app/server
COPY . /usr/src/app/server

EXPOSE 3000

CMD ["npm", "start"]
