var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var schema = new Schema({
  content: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0,
    required: true
  },
  dislikes: {
    type: Number,
    default: 0,
    required: true
  },
  ancestors: {
    type: [ObjectId],
    required: true
  },
  author: {
    type: ObjectId,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

exports.schema = mongoose.model('Comments', schema);
