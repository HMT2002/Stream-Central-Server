// playlist.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playlistSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  movieArr: [{
    type: Schema.Types.ObjectId,
    ref: 'Info'
  }]
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;
