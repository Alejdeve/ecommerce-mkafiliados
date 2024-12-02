const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Registro
router.post('/register', async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: 'User already exists' }); // Cambio aquí
        }

        user = new User(req.body);
        await user.save();

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: {
                _id: user._id,
                email: user.email,
                profile: user.profile
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message }); // Cambio aquí
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' }); // Cambio aquí
        }

        const isMatch = await user.comparePassword(req.body.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' }); // Cambio aquí
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                _id: user._id,
                email: user.email,
                profile: user.profile
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message }); // Cambio aquí
    }
});

module.exports = router;