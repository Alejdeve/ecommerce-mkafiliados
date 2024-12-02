const { app } = require('./src/app');
const mongoose = require('mongoose');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

// Verificación de variables de entorno
console.log('Environment Variables:');
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });