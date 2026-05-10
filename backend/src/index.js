require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(express.json());

// Connexion DB
connectDB();

// Routes
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/projects',      require('./routes/projects'));
//app.use('/api/tasks',         require('./routes/tasks'));
//app.use('/api/dashboard',     require('./routes/dashboard'));
//app.use('/api/members',       require('./routes/members'));
//app.use('/api/activities',    require('./routes/activities'));
//app.use('/api/notifications', require('./routes/notifications'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur sur le port ${PORT} 🚀`));
