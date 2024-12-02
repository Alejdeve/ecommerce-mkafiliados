const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// Verificación de variables de entorno al inicio
console.log('JWT_SECRET está definido:', !!process.env.JWT_SECRET);
console.log('MONGODB_URI está definido:', !!process.env.MONGODB_URI);

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');

const app = express();

// Middleware
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

module.exports = { app };