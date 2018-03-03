'use strict'

const BASE_DOMAIN = process.env.BASE_DOMAIN || 'jakartajs.test'

const config = {
  BASE_DOMAIN,
  MONGODB_CONNECT_URL: process.env.MONGODB_MASTER_TEST || 'mongodb://localhost/workshop-jakarta-js-test',
  SERVER: {
    port: 9321,
    hostname: process.env.HOSTNAME || '127.0.0.1'
  }
}

module.exports = config
