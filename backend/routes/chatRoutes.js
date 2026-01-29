const express = require('express');
const router = express.Router();
const {sendMessage,getMessages} = require('../controllers/chatController');
const {authenticate} = require('../middleware/auth');

router.use(authenticate);
router.post('/send',  sendMessage);
router.get('/messages', getMessages);

module.exports = router;
