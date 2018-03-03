'use strict'

const { readdirSync } = require('fs')
const { basename, extname } = require('path')
const CONFIG = require('../config')

module.exports = app => {
  const routerDir = `${CONFIG.ROOT_DIR}/app/routes`

  readdirSync(routerDir).forEach(file => {
    let filename = basename(file, extname(file))

    if (~file.indexOf('.js') && filename !== 'index') {
      app.use('/v1/' + filename, require(`${routerDir}/${file}`))
    }
  })
}
