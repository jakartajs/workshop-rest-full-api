'use strict'

const MeetupsModel = require('../models/meetups')
const ErrorHandler = require('../middlewares/error')
const httpStatus = require('http-status')
const slugify = require('slugg')
const randomstring = require('randomstring')
// const validator = require('express-joi-validation')({})

exports.create = (req, res, next) => {
  const data = req.body

  if (!data.slug) {
    data.slug = slugify(`${data.name}${randomstring.generate(3)}`, { toLowerCase: true })
  }

  const meetup = new MeetupsModel(data)

  meetup.save((err, created) => {
    if (err) return ErrorHandler.response(err, req, res, next)

    return res.status(httpStatus.CREATED).json(created)
  })
}

exports.get = (req, res, next) => {
  const meetupId = req.params.meetupId

  MeetupsModel
    .findById(meetupId, '-__v')
    .lean() // make output as lean object
    .exec((err, meetup) => {
      if (err) return ErrorHandler.response(err, res, res, next)

      if (!meetup) return ErrorHandler.response({status: httpStatus.NOT_FOUND, message: 'meetup not found'}, req, res)

      return res.status(httpStatus.OK).json(meetup)
    })
}

exports.update = (req, res, next) => {
  const meetupId = req.params.meetupId
  const data = req.body

  MeetupsModel
    .findByIdAndUpdate(meetupId, { $set: data }, { new: true })
    .exec((err, update) => {
      if (err) return ErrorHandler.response(err, req, res, next)

      if (!update) return ErrorHandler.response({status: httpStatus.NOT_FOUND, message: 'User not found'}, req, res)

      return res.status(httpStatus.OK).json(update)
    })
}
