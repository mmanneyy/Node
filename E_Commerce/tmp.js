const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { writeData, readData } = require('../utils/jsonStore')('users');
const route = express.Router();

// Very simple in-memory sessions (OK for homework; not for production)
const sessions = new Map(); // token -> { userId, createdAt }

route.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const users = await readData();

    // Your users are stored like: users[uniqueId] = { uniqueId, email, password: hash, ... }
    const user = Object.values(users).find(
      (u) => u.email?.toLowerCase() === String(email).trim().toLowerCase()
    );

    // Same message for "not found" and "wrong password"
    const invalidMsg = 'Invalid credentials';

    if (!user) {
      return res.status(401).json({ message: invalidMsg });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: invalidMsg });
    }

    // Create a session token
    const token = crypto.randomBytes(32).toString('hex');
    sessions.set(token, { userId: user.uniqueId, createdAt: new Date().toISOString() });

    // Send cookie (best practice: httpOnly cookie)
    res.cookie('session', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({
      message: 'Logged in',
      user: { id: user.uniqueId, email: user.email, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = route;
