const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: String,
  phone: String,
  imageUrl: String,
  group: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact'  // references other contacts (group members)
  }],
  isDept: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Contact', ContactSchema);
