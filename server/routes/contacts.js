const express = require('express');
const router = express.Router();

const Contact = require('../models/contact');
const sequenceGenerator = require('./sequenceGenerator');

// GET all contacts
router.get('/', async (req, res, next) => {
  try {
    const contacts = await Contact.find().populate('group').exec();
    res.status(200).json({
      message: 'Contacts fetched successfully',
      contacts: contacts
    });
  } catch (err) {
    res.status(500).json({
      message: 'An error occurred',
      error: err
    });
  }
});

// POST a new contact
router.post('/', async (req, res, next) => {
  try {
    const maxContactId = await sequenceGenerator.nextId('contacts');

    // Convert group string ids to actual ObjectIds
    let groupIds = [];
    if (req.body.group && req.body.group.length > 0) {
      groupIds = await Promise.all(req.body.group.map(async contactId => {
        const contact = await Contact.findOne({ id: contactId });
        return contact ? contact._id : null;
      }));
      groupIds = groupIds.filter(id => id !== null);
    }

    const contact = new Contact({
      id: maxContactId.toString(),
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      imageUrl: req.body.imageUrl,
      group: groupIds,
      isDept: req.body.isDept || false
    });

    const createdContact = await contact.save();

    res.status(201).json({
      message: 'Contact added successfully',
      contact: createdContact
    });
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred',
      error: error
    });
  }
});

// PUT to update an existing contact
router.put('/:id', async (req, res, next) => {
  try {
    const contact = await Contact.findOne({ id: req.params.id }).exec();

    if (!contact) {
      return res.status(404).json({
        message: 'Contact not found',
        error: { contact: 'Contact not found' }
      });
    }

    // Resolve group ids
    let groupIds = [];
    if (req.body.group && req.body.group.length > 0) {
      groupIds = await Promise.all(req.body.group.map(async contactId => {
        const groupContact = await Contact.findOne({ id: contactId });
        return groupContact ? groupContact._id : null;
      }));
      groupIds = groupIds.filter(id => id !== null);
    }

    // Update fields
    contact.name = req.body.name;
    contact.email = req.body.email;
    contact.phone = req.body.phone;
    contact.imageUrl = req.body.imageUrl;
    contact.group = groupIds;
    contact.isDept = req.body.isDept;

    const result = await Contact.updateOne({ id: req.params.id }, contact).exec();

    res.status(200).json({
      message: 'Contact updated successfully',
      result: result
    });

  } catch (err) {
    res.status(500).json({
      message: 'An error occurred',
      error: err
    });
  }
});

// DELETE a contact by ID
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await Contact.deleteOne({ id: req.params.id }).exec();

    if (result.deletedCount > 0) {
      res.status(200).json({
        message: 'Contact deleted successfully'
      });
    } else {
      res.status(404).json({
        message: 'Contact not found',
        error: { contact: 'Contact not found' }
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