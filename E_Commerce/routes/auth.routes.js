const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { writeData, readData } = require('../utils/jsonStore')('users');
const validateUser = require('../utils/validations');

const route = express.Router();

route.post('/register', async (req, res) => {
  try {
    const user = req.body;
    const users = await readData();
    validateUser(user, users);

    const hashedPassword = await bcrypt.hash(user.password, 10);

    const uniqueId = crypto.randomUUID();
    users[uniqueId] = {
      uniqueId,
      ...user,
      role: user.role || 'customer',
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };
    writeData(users);
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
route.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body ?? {};
        if(!email || ! password) {
            return res.status(400).json({message: 'Email and password are required'});
        }
        const users = await readData();
        const user = Object.values(users).find()
    } catch {

    }
});

module.exports = route;