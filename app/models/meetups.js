'use strict'

const mongoose = require('mongoose')
const mongooseUniqueValidator = require('mongoose-unique-validator')

const MeetupSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'Meetup name cannot be blank'],
    minLength: [10, 'Description must be 10 characters long']
  },
  slug: {
    type: String,
    trim: true,
    unique: true
  },
  headline: {
    type: String
  },
  description: {
    type: String,
    required: [true, 'Description cannot be blank'],
    minLength: [10, 'Description must be 10 characters long']
  },
  logo_url: {
    type: String
  },
  city: {
    type: String,
    required: [true, 'City cannot be blank']
  },
  country: {
    type: String,
    required: [true, 'country cannot be blank']
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'meetups'
})

MeetupSchema.plugin(mongooseUniqueValidator)

module.exports = mongoose.model('Meetups', MeetupSchema)
