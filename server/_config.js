var config = {};

config.mongoURI = {
  development: 'mongodb://mongodb:27017/wambo',
  test: 'mongodb://mongodb:27017/wambotest'
};

config.secret = "plusultra"

module.exports = config;
