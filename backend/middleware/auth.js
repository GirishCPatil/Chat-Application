const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        const user = jwt.verify(token, 'secretKey');

        User.findByPk(user.userId).then(user => {
          
            if (!user) {
               
                throw new Error('User not found'); 
            }
            req.user = user;
            next();
        }).catch(err => {
            
            return res.status(401).json({success: false, message: "User not found"});
        });

    } catch(err) {
        console.log(err);
        return res.status(401).json({success: false, message: "Invalid Token"});
    }
}

module.exports = { authenticate };