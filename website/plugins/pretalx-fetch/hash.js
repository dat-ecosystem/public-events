const crypto = require('crypto')
const { Encoder } = require('base32.js')

module.exports = function hash (data) {
  const hash = crypto.createHash('md5')
  hash.update(data)
  const encoder = new Encoder({ type: 'crockford', lc: true })
  return encoder.write(hash.digest()).finalize()
}
