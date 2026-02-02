const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt= require('jsonwebtoken');

const signup = async(req, res) => {
   const { name, email, phone, password } = req.body;
   try {
     if(!name || !email || !phone || !password) {
        return res.status(400).send('All fields are required');
    }

    const existingUser = await User.findOne({ where: { email } });
    if(existingUser) {
        return  res.status(409).send('User with this email already exists');
    }

    const hashedpassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, phone, password: hashedpassword });
    if(!user) { return res.status(400).send('Invalid credentials') }
    res.status(201).send('User registered successfully');
   } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).send('Internal server error');
   }
      
}

const login = async (req, res) => {
   const { email, password } = req.body;
   try {
      if(!email || !password) {
         return res.status(400).send('Email and password are required');
      }

      const user = await User.findOne({ where: { email } });
      if(!user) {
         return res.status(404).send('User not found');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if(!isPasswordValid) {
         return res.status(401).send('Invalid credentials');
      }

      const token = jwt.sign({ userId: user.id },
         'secretKey', 
         { expiresIn: '1h' });

      res.status(200).json({ token });

   } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).send('Internal server error');
   }
}

module.exports = { signup, login };