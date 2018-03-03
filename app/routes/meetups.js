'use strict'

const express = require('express')
const Route = express.Router()
const MeetupsController = require('../controllers/meetups')

Route
  .post('/members/joins', MeetupsController.memberJoinMeetup)
  .get('/:meetupId/members', MeetupsController.members)
  .post('/create', MeetupsController.create)
  .put('/:meetupId', MeetupsController.update)
  .get('/:meetupId', MeetupsController.get)

module.exports = Route
