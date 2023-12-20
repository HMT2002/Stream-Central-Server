// comment.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  movie: {
    type: Schema.Types.ObjectId,
    ref: 'Info'
  },
  conversation: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    text: {
      type: String
    }
  }]
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
