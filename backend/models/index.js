const User = require('./User');
const Message = require('./Messages');

User.hasMany(Message);
Message.belongsTo(User);

