/* global db NODE_ENV */

'use strict'

require('dotenv').config()

global.NODE_ENV = process.env.NODE_ENV || 'development'

const CONFIG = require('./app/config')
const app = require('./app/config/express')

global.db = require('./app/config/mongodb')(CONFIG.MONGODB_CONNECT_URL)

db.connection.on('connected', () => {
  app.listen(CONFIG.SERVER.port, () => {
    if (NODE_ENV === 'development') {
      console.log('\n✔ JakartaJS API is runing on http://%s in %s mode', CONFIG.SERVER.hostname + ':' + CONFIG.SERVER.port, NODE_ENV)
    }
  })
})

module.exports = { app, db }
