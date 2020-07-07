const runfetch = require('./runfetch')

module.exports = {
  async onPreBuild ({ inputs, utils }) {
    const { conferences, targetDomain, ttl } = inputs
    const { cache } = utils
    runfetch({
      conferences, targetDomain, ttl, cache
    })
  }
}
