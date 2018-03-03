'use strict'

module.exports = {
  ROOT_DIR: process.cwd(),
  SERVER: {
    port: process.env.APP_PORT || 4000,
    hostname: process.env.HOSTNAME || '127.0.0.1'
  },
  MONGODB_CONNECT_URL: process.env.MONGODB_MASTER
}
