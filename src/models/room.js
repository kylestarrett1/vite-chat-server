const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./user');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'New Room',
    trim: true,
  },

  description: {
    type: String,
    required: false,
    default: 'No description',
    trim: true,
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});
