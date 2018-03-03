'use strict'

const express = require('express')
const Route = express.Router()

Route
  .get('/', (req, res) => res.status(200).send('OK'))

module.exports = Route
