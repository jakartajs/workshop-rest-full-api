'use strict'

const util = require('util')
const extend = require('extend')
const confByEnv = require(util.format('./%s.config.js', process.env.NODE_ENV || 'development'))

const confAll = require('./all')
const config = extend({}, confAll, confByEnv)

module.exports = config
