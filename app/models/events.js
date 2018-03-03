'use strict'

const mongoose = require('mongoose')
const mongooseUniqueValidator = require('mongoose-unique-validator')

const EventSchema = new mongoose.Schema({
  meetup: {
    type: mongoose.Schema.ObjectId,
    ref: 'Meetups',
    index: true
  },
  hosted: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Users',
    index: true,
    required: true
  }],
  description: {
    type: String,
    required: [true, 'Description cannot be blank'],
    minLength: [10, 'Description must be 10 characters long']
  },
  start_date: {
    type: Date,
    require: true
  },
  end_date: {
    type: Date,
    require: true
  },
  location: {
    type: String
  },
  attendees: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'Users',
      index: true,
      required: true
    },
    is_going: {
      type: String,
      required: true,
      default: 'yes',
      enum: ['yes', 'no']
    },
    rsvp_date: {
      type: Date,
      default: new Date()
    }
  }],
  seat_number: {
    type: Number
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'events'
})

EventSchema.plugin(mongooseUniqueValidator)

module.exports = mongoose.model('Events', EventSchema)
