const express = require('express');
const sequelize = require('./utils/db');
const PORT = process.env.PORT || 4000;
const app = express();  
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

app.use(cors());
app.use(express.json());
app.use('/user', userRoutes);


app.get('/', (req, res) => {
  res.send('Hello, World!');
}
);


sequelize.sync()
    .then(() => {
        console.log('Database & tables created!');
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 
    })
    .catch(err => {
        console.error('Unable to sync the database:', err);
    }); 


