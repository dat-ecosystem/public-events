const hash = require('./hash')
const package = require('./package.json')
const cachedir = require('cachedir')(package.name)

module.exports = function (location) {
  return `${cachedir}/${hash(location)}`
}
