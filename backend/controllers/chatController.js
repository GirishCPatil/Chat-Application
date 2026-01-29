const Message = require('../models/Messages');

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id; // from auth middleware

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    const newMessage = await Message.create({
      message,
      UserId: userId
    });

    res.status(201).json(newMessage);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      order: [['createdAt', 'ASC']]
    });

    res.json(messages);

  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { sendMessage, getMessages };