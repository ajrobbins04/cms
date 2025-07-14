const mongoose = require('mongoose');

const SequenceSchema = new mongoose.Schema({
    maxDocumentId: { type: Number, required: true },
    maxContactId: { type: Number, required: true },
    maxMessageId: { type: Number, required: true }
}, {collection: 'sequences'});

module.exports = mongoose.model('Sequence', SequenceSchema); 