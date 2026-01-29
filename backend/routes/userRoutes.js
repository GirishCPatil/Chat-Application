const express = require('express');
const router = express.Router();


router.get('/signup', createUser);
router.post('/login', loginUser);

module.exports = router;