const express = require("express");
const router = express.Router();
const sequenceGenerator = require("./sequenceGenerator");
const Message = require("../models/message");
const Contact = require("../models/contact");

// GET all messages
router.get("/", async (req, res, next) => {
  try {
    // Replace ObjectId w/sender's Contact object
    const messages = await Message.find().populate("sender").exec(); 
    res.status(200).json({
      message: "Messages fetched successfully",
      messages: messages,
    });
  } catch (err) {
    res.status(500).json({
      message: "An error occurred",
      error: err,
    });
  }
});

// POST a new message
router.post("/", async (req, res, next) => {

  try {
    // Find the sender's contact by name
    const sender = await Contact.findOne({ name: req.body.sender.name }).exec();

    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }

    const maxMessageId = await sequenceGenerator.nextId("messages");

    const message = new Message({
      id: maxMessageId.toString(), // Convert to string (must be number to increment)
      subject: req.body.subject,
      msgText: req.body.msgText,
      sender: sender._id  // Use the sender's ObjectId instead of name
    });

    const createdMessage = await message.save();
    res.status(201).json({
      message: "Message added successfully",
      messageData: createdMessage
    });

  } catch (err) {
    console.error("Error in POST /messages:", err);
    res.status(500).json({ message: "An error occurred", error: err.message });
  }
});

// PUT (update) a message by ID
router.put("/:id", async (req, res, next) => {
  try {
    const message = await Message.findOne({ id: req.params.id }).exec();

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
        error: { message: "Message not found" },
      });
    }

    message.subject = req.body.subject;
    message.msgText = req.body.msgText;
    message.sender = req.body.sender;

    const result = await Message.updateOne(
      { id: req.params.id },
      message
    ).exec();

    res.status(200).json({
      message: "Message updated successfully",
      result: result,
    });
  } catch (err) {
    res.status(500).json({
      message: "An error occurred",
      error: err,
    });
  }
});

// DELETE a message by ID
router.delete("/:id", async (req, res, next) => {
  try {
    const result = await Message.deleteOne({ id: req.params.id }).exec();

    if (result.deletedCount > 0) {
      res.status(200).json({
        message: "Message deleted successfully",
      });
    } else {
      res.status(404).json({
        message: "Message not found",
        error: { message: "Message not found" },
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "An error occurred",
      error: err,
    });
  }
});

module.exports = router;
