'use strict'

const mongoose = require('mongoose')

const Members = new mongoose.Schema({
  meetup: {
    type: mongoose.Schema.ObjectId,
    ref: 'Meetups',
    required: true,
    index: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users',
    index: true,
    required: true
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'members'
})

module.exports = mongoose.model('Members', Members)
