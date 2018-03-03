'use strict'

const CONFIG = require('../config/index')
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const compress = require('compression')
const methodOverride = require('method-override')
const cors = require('cors')
const helmet = require('helmet')
const responseTime = require('response-time')
const errorhandler = require('errorhandler')

const error = require('../middlewares/error')

/**
* Express instance
* @public
*/
const app = express()

// request logging. dev: console | production: file

// parse body params and attache them to req.body
app.use(bodyParser.json({ limit: '20mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '20mb' }))

// gzip compression
app.use(compress())

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride())

// secure apps by setting various HTTP headers
app.use(helmet())

// enable CORS - Cross Origin Resource Sharing
app.use(cors())

// mount api v1 routes
require(CONFIG.ROOT_DIR + '/app/routes')(app)

app.use(error.stack)

// assume 404 since no middleware responded
app.use(error.notFound)

if (process.env.NODE_ENV === 'development') {
  // Development-only error stack traces handler
  app.use(errorhandler())
  app.use(morgan('dev'))
  // Response time for Node.js servers
  app.use(responseTime())
}

module.exports = app
