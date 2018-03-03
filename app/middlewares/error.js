'use strict'

const httpStatus = require('http-status')

/**
 * Error handler. Send stacktrace only during development
 * @public
 */
exports.response = (err, req, res, next) => {
  const statusCode = err.status || httpStatus.INTERNAL_SERVER_ERROR
  const response = {
    code: statusCode,
    message: err.message || httpStatus[statusCode],
    errors: err.errors,
    stack: err.stack
  }

  if (process.env.NODE_ENV !== 'development') {
    delete response.stack
  }

  return res.status(statusCode).json(response)
}

/**
 * If error is not an instanceOf APIError, convert it.
 * @public
 */
exports.stack = (err, req, res, next) => {
  // treat as 404
  if (err.message && (~err.message.indexOf('not found') || (~err.message.indexOf('Cast to ObjectId failed')))) {
    return next()
  }

  const output = {
    message: err.message || err.stack || httpStatus[err.status || httpStatus.INTERNAL_SERVER_ERROR],
    status: httpStatus.INTERNAL_SERVER_ERROR
  }

  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack)
    output.stack = err.stack
  }

  return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(output)
}

/**
 * Catch 404 and forward to error handler
 * @public
 */
exports.notFound = (req, res, next) => {
  const output = {
    message: 'Not found',
    status: httpStatus.NOT_FOUND
  }

  return res.status(httpStatus.NOT_FOUND).json(output)
}
