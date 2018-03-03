'use strict'

const express = require('express')
const Route = express.Router()
const UsersController = require('../controllers/users')

Route
  .post('/register', UsersController.register)
  .post('/login', UsersController.login)
  .put('/:userId', UsersController.update)
  .delete('/:userId', UsersController.remove)
  .get('/:userId', UsersController.get)

module.exports = Route
