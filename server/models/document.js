const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: String,
    url: String,
    children: [{
      id: String,
      name: String,
      description: String,
      url: String,
      children: [this],  // children can be nested documents
    }]
  });
  
  module.exports = mongoose.model('Document', DocumentSchema);