const express = require('express');
const router = express.Router();

const sequenceGenerator = require('./sequenceGenerator');
const Document = require('../models/document');

router.get('/', async function(req, res, next) {
    try {
        // Fetch all documents 
        const documents = await Document.find().exec();
        res.status(200).json({
            message: 'Documents fetched successfully',
            documents: documents
        });
    } catch (err) {
        res.status(500).json({
            title: 'An error occurred',
            error: err
        });
    }
});

router.post('/', async (req, res, next) => {
    try {
      const maxDocumentId = await sequenceGenerator.nextId('documents');
  
      const document = new Document({
        id: maxDocumentId,
        name: req.body.name,
        description: req.body.description,
        url: req.body.url
      });
  
      const createdDocument = await document.save();
  
      res.status(201).json({
        message: 'Document added successfully',
        document: createdDocument
      });
    } catch (error) {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    }
  });

  router.put('/:id', async (req, res, next) => {
    try {
      const document = await Document.findOne({ id: req.params.id }).exec();
  
      if (!document) {
        return res.status(404).json({
          message: 'Document not found',
          error: { document: 'Document not found' }
        });
      }
  
      document.name = req.body.name;
      document.description = req.body.description;
      document.url = req.body.url;
  
      const result = await Document.updateOne({ id: req.params.id }, document).exec();
  
      if (result.nModified > 0) {
        res.status(200).json({
          message: 'Document updated successfully',
          result: result
        });
      } else {
        res.status(200).json({
          message: 'No changes made to the document',
          result: result
        });
      }
  
    } catch (err) {
      res.status(500).json({
        message: 'An error occurred',
        error: err
      });
    }
  });
  router.delete('/:id', async (req, res, next) => {
    try {
      const result = await Document.deleteOne({ id: req.params.id }).exec();
  
      if (result.deletedCount > 0) {
        res.status(200).json({  // Changed from 204 to 200 so body is sent
          message: 'Document deleted successfully',
        });
      } else {
        res.status(404).json({  // 404 is more appropriate for "not found"
          message: 'Document not found',
          error: { document: 'Document not found' }
        });
      }
  
    } catch (err) {
      res.status(500).json({
        message: 'An error occurred',
        error: err
      });
    }
  });
  
module.exports = router; 