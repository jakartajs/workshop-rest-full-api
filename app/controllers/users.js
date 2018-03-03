'use strict'

const UsersModel = require('../models/users')
const ErrorHandler = require('../middlewares/error')
const httpStatus = require('http-status')
const slugify = require('slugg')
const randomstring = require('randomstring')

exports.register = (req, res, next) => {
  const data = req.body

  if (!data.username) {
    data.username = slugify(`${data.fullname}${randomstring.generate(3)}`, { toLowerCase: true })
  }

  const user = new UsersModel(data)

  user.save((err, created) => {
    if (err) return ErrorHandler.response(err, req, res, next)

    return res.status(httpStatus.CREATED).json(created)
  })
}

exports.get = (req, res, next) => {
  const userId = req.params.userId

  UsersModel
    .findById(userId, '-__v')
    .lean() // make output as lean object
    .exec((err, user) => {
      if (err) return ErrorHandler.response(err, res, res, next)

      if (!user) return ErrorHandler.response({status: httpStatus.NOT_FOUND, message: 'User not found'}, req, res)

      return res.status(httpStatus.OK).json(user)
    })
}

exports.update = (req, res, next) => {
  const userId = req.params.userId
  const data = req.body

  UsersModel
    .findByIdAndUpdate(userId, { $set: data }, { new: true })
    .exec((err, update) => {
      if (err) return ErrorHandler.response(err, req, res, next)

      if (!update) return ErrorHandler.response({status: httpStatus.NOT_FOUND, message: 'User not found'}, req, res)

      return res.status(httpStatus.OK).json(update)
    })
}

exports.remove = (req, res, next) => {
  const userId = req.params.userId

  UsersModel
    .findByIdAndRemove(userId)
    .exec((err, update) => {
      if (err) return ErrorHandler.response(err, req, res, next)

      if (!update) return ErrorHandler.response({status: httpStatus.NOT_FOUND, message: 'User not found'}, req, res)

      return res.status(httpStatus.NO_CONTENT).json()
    })
}

exports.login = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password

  UsersModel
    .findOne({ email: email })
    .exec((err, user) => {
      if (err) return ErrorHandler.response(err, req, res, next)

      if (!user) return ErrorHandler.response({status: httpStatus.NOT_FOUND, message: 'Email does not exist'}, req, res)

      if (!user.authenticate(password)) {
        return ErrorHandler.response({status: httpStatus.UNAUTHORIZED, message: 'Password is invalid'}, req, res)
      }

      return res.status(httpStatus.OK).json(user)
    })
}
