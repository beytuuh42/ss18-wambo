var config = {};

config.mongoURI = {
  development: 'mongodb://localhost:27017/wambo',
  test: 'mongodb://localhost:27017/wambotest'
};

config.secret = "plusultra"

module.exports = config;
