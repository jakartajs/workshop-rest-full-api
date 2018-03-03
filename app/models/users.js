'use strict'

const mongoose = require('mongoose')
const crypto = require('crypto')
const mongooseUniqueValidator = require('mongoose-unique-validator')

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'Username cannot be blank'],
    index: true
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email cannot be blank'],
    lowercase: true,
    trim: true
  },
  fullname: {
    type: String,
    trim: true,
    required: [true, 'Firstname cannot be blank']
  },
  photo_profile: String,
  bio: {
    type: String
  },
  city: {
    type: String
  },
  country: {
    type: String
  },
  hashed_password: {
    type: String,
    required: [true, 'Password cannot be blank']
  },
  salt: {
    type: String
  },
  last_login: {
    type: Date
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'users'
})

/**
 * Virtuals
 */

UserSchema
  .virtual('password')
  .set(function (password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function () { return this._password })

/**
 * Validations
 */

// const validatePresenceOf = value => value && value.length

/**
 * Methods
 */

UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt () {
    return `${Math.round((new Date().valueOf() * Math.random()))}`
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword (password) {
    if (!password) return ''

    let encrypted
    let salt = this.salt || this.makeSalt()

    try {
      encrypted = crypto.createHmac('sha1', salt).update(password).digest('hex')

      return encrypted
    } catch (err) {
      return ''
    }
  }
}

UserSchema.plugin(mongooseUniqueValidator)

module.exports = mongoose.model('Users', UserSchema)
