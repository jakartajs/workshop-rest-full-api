'use strict'

const extend = require('extend')
const mongoose = require('mongoose')

module.exports = (connectionUri, opt) => {
  mongoose.Promise = global.Promise

  run().catch(error => {
    if (error) console.error(error)
  })

  async function run () {
    const options = extend({}, {
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 500,
      poolSize: 10,
      keepAlive: 300,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      w: 'majority',
      wtimeout: 10000,
      j: true,
      autoIndex: false
    }, opt || {})

    await mongoose.connect(connectionUri, options)

    mongoose.connection.on('disconnected', () => {
      console.error(`✗ MongoDB ${connectionUri} is disconnected`)
    })

    mongoose.connection.on('error', (err) => {
      console.error(`✗ MongoDB Connection to ${connectionUri} is Error. Please make sure MongoDB is running. -> ${err}`)
    })

    mongoose.connection.on('reconnect', (err) => {
      console.error(`✗ Try to reconnect to MongoDB ${connectionUri}. ${err}`)
    })

    mongoose.connection.on('reconnectFailed', (err) => {
      console.error(`✗ Try to reconnect to MongoDB ${connectionUri}. ${err}`)
    })
  }

  let gracefulExit = () => mongoose.connection.close(() => process.exit(0))

  process.on('SInGINT', gracefulExit).on('SIGTERM', gracefulExit)

  // mongoose.set('debug', true)
  return mongoose
}
