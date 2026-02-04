const express = require('express');
const sequelize = require('./utils/db');
const http = require('http');
const initSocket = require("./socket-io/socket");
const PORT = process.env.PORT || 4000;
const app = express();  




const cors = require('cors');
require("./models/index")
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const mediaRoutes = require("./routes/mediaRoutes");


const server = http.createServer(app);
initSocket(server);


app.use(cors());
app.use(express.json());
app.use('/user', userRoutes);
app.use('/chat', chatRoutes);
app.use("/media", mediaRoutes);


app.get('/', (req, res) => {
  res.send('Hello, World!');
}
);

sequelize.sync()
    .then(() => {
        console.log('Database & tables created!');
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 
    })
    .catch(err => {
        console.error('Unable to sync the database:', err);
    }); 


