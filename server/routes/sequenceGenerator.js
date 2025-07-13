const Sequence = require('../models/sequence');

var maxDocumentId;
var maxContactId;
var maxMessageId;
var sequenceId = null;

function SequenceGenerator() {
    this.maxDocumentId = 0; // default values
    this.maxContactId = 0; 
    this.maxMessageId = 0; 
}  

SequenceGenerator.prototype.initializeGenerator = async function () {
  try {
    const sequence = await Sequence.findOne().exec();

    if (sequence) {
        this.maxDocumentId = sequence.maxDocumentId;
        this.maxContactId = sequence.maxContactId;
        this.maxMessageId = sequence.maxMessageId;
        this.sequenceId = sequence._id;
      
    } else {
      console.error('No sequence document found');
    }
  } catch (err) {
    console.error('Failed to fetch max ID:', err);
  }
};

SequenceGenerator.prototype.nextId = async function(collectionType) {

  var updateObject = {};
  var nextId;
  
  switch (collectionType) {
    case 'documents':
      this.maxDocumentId++;
      updateObject = {maxDocumentId: maxDocumentId};
      nextId = this.maxDocumentId;
      break;
    case 'messages':
      this.maxMessageId++;
      updateObject = {maxMessageId: maxMessageId};
      nextId = this.maxMessageId;
      break;
    case 'contacts':
      this.maxContactId++;
      updateObject = {maxContactId: maxContactId};
      nextId = this.maxContactId;
      break;
    default:
      return -1;
  }
  
  Sequence.update({_id: sequenceId}, {$set: updateObject},
      function(err) {
        if (err) {
          console.log("nextId error = " + err);
          return null
        }
      });
      return nextId;

};

// export the singleton instance and initialize it
const sequenceGeneratorInstance = new SequenceGenerator();
sequenceGeneratorInstance.initializeGenerator(); 
module.exports = sequenceGeneratorInstance;
