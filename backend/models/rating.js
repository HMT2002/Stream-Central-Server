// rating.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ratingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  point: {
    type: Number,
    required: true
  },
  movie: {
    type: Schema.Types.ObjectId,
    ref: 'Info'
  }
});

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
