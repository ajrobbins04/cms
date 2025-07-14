const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    id: { type: String, required: true },
    subject: { type: String },
    msgText: { type: String, required: true },
    
    // Sender's unique ID is stored on the backend
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact'} 
});

module.exports = mongoose.model('Message', MessageSchema);