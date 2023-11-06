const mongoose = require('mongoose');

const infoSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Info required'] },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, required: [true, 'Info required'] },
  createDate: { type: Date, default: Date.now() },
  video: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', default: null, required: [true, 'Info required'] },
  details: { type: Object, required: [true, 'Info required'] },

});
const Info = mongoose.model('Info', infoSchema);

module.exports = Info;
