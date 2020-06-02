'use strict'
const fs = require('fs')

const path = require('path')
const ROOT = process.cwd()

const FE_ROOT = path.resolve(__dirname, '../')

let production = false

const feConfig = require(path.join(ROOT, 'fe-config'))
exports.feConfig = feConfig

const root = function() {
  var args = Array.prototype.slice.call(arguments, 0)
  return path.join.apply(path, [ROOT, 'src'].concat(args))
}

exports.root = root

exports.dest = function() {
  var args = Array.prototype.slice.call(arguments, 0)
  return path.join.apply(path, [ROOT, 'dist'].concat(args))
}

exports.setProduction = function(pro) {
  production = pro
}
exports.production = function() {
  return production
}
exports.getModel = function() {
  return production ? 'production' : 'development'
}

exports.feRoot = function() {
  var args = Array.prototype.slice.call(arguments, 0)
  return path.join.apply(path, [FE_ROOT].concat(args))
}
